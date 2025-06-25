"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Bandeau haut */}
      <div className="w-full bg-pink-200 h-36 relative">
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            src="/avatar-placeholder.png"
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="mt-16 w-full max-w-sm px-6">
        <h1 className="text-center text-2xl font-semibold mb-4">Mon Profil</h1>

        <p className="text-center font-medium text-gray-700 mb-6">{nom}</p>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Pseudo</label>
          <input
            type="text"
            value={nom}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1"
          />
        </div>

        <div className="mb-6 relative">
          <label className="text-sm font-medium text-gray-600">
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 pr-10"
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full border border-blue-600 text-blue-600 font-medium py-2 rounded-md hover:bg-blue-100 transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Modal de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white py-2 rounded-md mb-2"
            >
              Déconnexion
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-md"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
