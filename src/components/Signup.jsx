"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("utilisateur"); // valeur par défaut
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;

          // Vérifie si l'utilisateur est déjà dans la table
          const { data: existing, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single();

          // S'il n'existe pas encore, on l'ajoute
          if (!existing && !fetchError) {
            await supabase.from("users").insert({
              id: user.id,
              email: user.email,
              nom,
              role,
            });
          }

          router.push("/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [nom, role, router]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(`❌ ${authError.message}`);
    } else {
      setMessage(
        "✅ Compte créé ! Vérifie ton email pour confirmer ton inscription 📧"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Créer un compte
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          />

          {/* Rôles visibles à l’inscription */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="sexologue">Sexologue</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition"
          >
            S'inscrire
          </button>

          {message && (
            <p className="text-red-500 text-center font-medium">{message}</p>
          )}
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <a
            href="/login"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}
