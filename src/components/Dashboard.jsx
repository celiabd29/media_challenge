"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("users")
        .select("nom, email")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur :",
          error.message
        );
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-4 flex flex-col gap-6">
      {/* Profil utilisateur */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <img
          src="/avatar-placeholder.png"
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {user?.nom || "Chargement..."}
        </h2>
        <p className="text-gray-500 text-sm">{user?.email || ""}</p>

        <div className="w-full mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input
              type="password"
              value="password"
              readOnly
              className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Publier du contenu */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Publier du contenu
        </h3>
        <div className="flex flex-col gap-4">
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/article")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">📄</span>
              <span className="text-sm font-medium text-gray-800">
                Publier un article
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/video")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">📹</span>
              <span className="text-sm font-medium text-gray-800">
                Publier une vidéo
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/podcast")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">🎧</span>
              <span className="text-sm font-medium text-gray-800">
                Publier un podcast
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
        </div>
      </div>

      {/* Footer navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around py-3">
        <button className="text-gray-500 hover:text-blue-600">🏠</button>
        <button className="text-gray-500 hover:text-blue-600">🔍</button>
        <button className="text-gray-500 hover:text-blue-600">📥</button>
        <button className="text-blue-600 font-bold">👤</button>
      </nav>
    </div>
  );
}
