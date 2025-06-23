"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Étape 1 : Connexion avec Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setMessage("❌ Identifiants incorrects");
      return;
    }

    const user = authData.user;

    if (!user) {
      setMessage("❌ L'utilisateur n'a pas été trouvé.");
      return;
    }

    // Vérifie la session juste après l'authentification
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      setMessage("❌ Session expirée ou problème d'authentification.");
      return;
    }

    // Étape 2 : Récupération du rôle depuis la table 'users'
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      setMessage("❌ Impossible de récupérer le rôle utilisateur.");
      return;
    }

    const { role } = userData;

    // Mise à jour du rôle pour déclencher la redirection
    setRole(role);
  };

  useEffect(() => {
    console.log("Role:", role); // Débogage pour suivre la valeur du rôle

    if (role) {
      switch (role) {
        case "admin":
          router.push("/dashboard");
          break;
        case "sexologue":
          router.push("/espace-pro");
          break;
        case "utilisateur":
        default:
          router.push("/accueil");
          break;
      }
    }
  }, [role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Connexion
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 placeholder-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mt-4 border border-gray-300 placeholder-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 mt-4 rounded-md hover:bg-blue-700 transition"
          >
            Se connecter
          </button>

          {message && (
            <p className="text-red-500 text-center font-medium mt-2">
              {message}
            </p>
          )}
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Crée-en un ici
          </a>
        </p>
      </form>
    </div>
  );
}
