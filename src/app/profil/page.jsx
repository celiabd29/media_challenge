"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) return router.push("/login");

      const { data } = await supabase
        .from("users")
        .select("nom, email")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        setUser(session.user);
        setNom(data.nom);
        setEmail(data.email);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Bandeau rose + avatar */}
      <div className="w-full h-40 bg-[#E9C4DE] relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <img
            src="/avatar-placeholder.png"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center px-6 w-full max-w-sm self-center">
        {/* Message d'accueil */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Bonjour, {nom} 👋🏼
        </h2>
        <p className="text-sm text-gray-600 mb-6">Mon profil</p>

        <div className="w-full mb-4">
          <label className="text-sm text-gray-700 font-medium">Pseudo</label>
          <input
            type="text"
            value={nom}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        <div className="w-full mb-4">
          <label className="text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        <div className="w-full mb-6 relative">
          <label className="text-sm text-gray-700 font-medium">
            Mot de passe
          </label>
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

        <button
          onClick={handleLogout}
          className="w-full border-2 border-blue-500 text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
