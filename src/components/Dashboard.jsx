"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        router.push("/login");
        return;
      }

      // Récupérer toutes les infos utilisateur
      const { data, error } = await supabase
        .from("users")
        .select("id, email, nom, role")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors du chargement :", error.message);
      } else {
        setUserData(data);

        // Si c'est un admin, on récupère les autres données
        if (data.role === "admin") {
          fetchUsers();
          fetchMessages();
        }
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nom, email, role");
      if (!error) setUsersList(data);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*"); // adapte si besoin
      if (!error) setMessages(data);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute roleRequired="user">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenue, {userData.nom} 👋
          </h1>
          <p className="text-gray-700 text-base mb-1">📧 {userData.email}</p>
          <p className="text-gray-700 text-base mb-6">
            🔐 Rôle : {userData.role}
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium"
          >
            Se déconnecter
          </button>
        </div>

        {userData.role === "admin" && (
          <div className="mt-10 w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              👥 Utilisateurs
            </h2>
            <ul className="mb-6">
              {usersList.map((u) => (
                <li key={u.id} className="mb-2 border-b pb-2">
                  <p className="text-gray-700">
                    {u.nom} – {u.email} ({u.role})
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              💬 Messages
            </h2>
            <ul>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <li key={msg.id} className="mb-2 border-b pb-2">
                    <p className="text-gray-700">{msg.contenu}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Aucun message</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
