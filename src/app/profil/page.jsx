"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Navbar from "@/components/BottomNavbar";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useDarkMode } from '@/contexts/DarkModeContext';
import { EyeIcon, EyeOffIcon, LogOut, Edit3 } from "lucide-react";

export default function ProfilPage() {
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) return router.push("/login");

      const { data } = await supabase
        .from("users")
        .select("nom, email, avatar_url")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        setUser(session.user);
        setNom(data.nom);
        setEmail(data.email);
        setAvatarUrl(data.avatar_url);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const result = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    console.log("📤 Upload response :", result);
    if (result.error) {
      console.error("❌ Erreur complète :", result.error);
      return;
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrl);

    await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
  };

  return (
    <div className={`${darkMode ? 'bg-[#242424] text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
      {/* Bandeau haut + avatar */}
      <div className="w-full h-40 bg-[#C9DAF8] relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={avatarUrl || "/avatar-placeholder.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer">
              <Edit3 size={16} className="text-gray-700" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center px-6 w-full max-w-sm self-center">
        <h2 className="text-xl font-semibold">{nom}</h2>

        <p className="text-md self-start font-medium mt-4 mb-3">Coordonnées et identifiants</p>

        <div className="w-full mb-4">
          <label className="text-sm font-medium">Prénom et nom</label>
          <input
            type="text"
            value={nom}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        <div className="w-full mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        <div className="w-full mb-6 relative">
          <label className="text-sm font-medium">Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 pr-10 bg-white text-gray-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-3 text-gray-600"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        <DarkModeToggle />

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full border-2 border-blue-500 text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition"
        >
          Déconnexion
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg flex flex-col items-center gap-4">
            <LogOut size={24} className="text-blue-600" />
            <p className="text-center text-sm text-gray-700">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white py-2 rounded-md font-semibold"
              >
                Déconnexion
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="border border-blue-500 text-blue-600 py-2 rounded-md font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
    </div>
  );
}
