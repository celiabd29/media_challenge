"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError)
      return setMessage("❌ Identifiants incorrects ou email non confirmé.");

    const user = authData.user;
    if (!user) return setMessage("❌ Erreur de session.");

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id);

    if (!existing || existing.length === 0) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        nom: user.user_metadata?.nom || "",
        role: user.user_metadata?.role || "utilisateur",
      });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id);

    const role = userData?.[0]?.role || "utilisateur";
    if (role === "admin") router.push("/dashboard");
    else if (role === "sexologue") router.push("/espace-pro");
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10">
      <img src="/logo.png" alt="logo" className="w-34 h-34 mb-6 mt-4" />

      <h1 className="text-2xl font-bold text-gray-800 mb-1">Bienvenue</h1>
      <p className="text-sm text-gray-600 mb-6">Connectez vous :</p>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-gray-50 rounded-xl space-y-4"
      >
        {/* Email */}
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3">
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
            className="text-gray-400 "
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>

        {/* Lien mot de passe oublié */}
        <div className="text-sm text-right text-blue-500 mt-1 mb-1">
          <a href="/forgot-password" className="underline">
            Mot de passe oublié ?
          </a>
        </div>

        {/* Switch */}
        <div className="flex items-center space-x-2 mb-2 mt-2">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-all">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all shadow" />
            </div>
          </label>
          <span className="text-sm text-gray-700 ml-2">Se souvenir de moi</span>
        </div>

        {/* Boutons */}
        <div className="flex flex-col space-y-3 mt-6">
          <button
            type="submit"
            className="w-full border-2 border-blue-500 text-blue-600 bg-white py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            CONNEXION
          </button>
          <a
            href="/signup"
            className="w-full text-center border-2 mt-3 border-blue-500 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            INSCRIPTION
          </a>
        </div>

        {message && (
          <p className="text-red-500 text-center font-medium mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
