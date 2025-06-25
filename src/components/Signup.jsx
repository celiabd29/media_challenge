"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

export default function Signup() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("utilisateur");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;
          const { data: existing } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single();

          if (!existing) {
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
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom,
          role,
        },
      },
    });

    if (authError) {
      setMessage(`❌ ${authError.message}`);
    } else {
      setMessage("✅ Compte créé ! Vérifie ton email pour confirmer 📧");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10">
      <img src="/logo.png" alt="logo" className="w-34 h-34 mb-6 mt-4" />

      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Inscrivez vous :
      </h1>

      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-gray-50 rounded-xl space-y-4 mt-6"
      >
        {/* Nom */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3">
          <UserIcon size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Prénom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
        </div>

        {/* Email */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md mt-3 px-3">
          <MailIcon size={20} className="text-gray-400" />
          <input
            type="email"
            placeholder="abc@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
        </div>

        {/* Password */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md mt-3 px-3">
          <LockIcon size={20} className="text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md mt-3 px-3">
          <LockIcon size={20} className="text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-2 py-3 text-sm focus:outline-none text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-gray-400"
          >
            {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        {/* Boutons */}
        <div className="flex flex-col space-y-3 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
          >
            INSCRIPTION
          </button>
          <p className="text-sm text-center text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <a
              href="/login"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Connectez-vous
            </a>
          </p>
        </div>

        {message && (
          <p className="text-red-500 text-center font-medium mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
