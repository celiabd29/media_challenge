"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";
import Image from 'next/image';
// import emotionsImg from '../assets/img/emotions.png';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        {/* Illustration */}
        <div className="h-16 w-16 mb-6">
          <Image
            // src={emotionsImg}
            alt="Illustration"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        {/* Titre */}
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-medium text-gray-900">Bienvenue</h1>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleLogin} className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-6 bg-gray-50 rounded-xl p-4">
          {/* Titre du formulaire */}
          <h2 className="text-2xl font-medium text-gray-700 mb-[19px]">
            Connectez-vous
          </h2>
          {/* Email avec icône */}
          <div className="relative mb-[14px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <path
                d="M16.3288 8.98996L12.4188 12.138C11.6789 12.7182 10.6416 12.7182 9.90168 12.138L5.95813 8.98996"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.81392 3.89224H15.4562C16.7023 3.90622 17.8883 4.43301 18.738 5.34993C19.5878 6.26685 20.027 7.49385 19.9535 8.74518V14.7291C20.027 15.9804 19.5878 17.2074 18.738 18.1243C17.8883 19.0412 16.7023 19.568 15.4562 19.582H6.81392C4.13734 19.582 2.33337 17.4045 2.33337 14.7291V8.74518C2.33337 6.06974 4.13734 3.89224 6.81392 3.89224Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="email"
              placeholder="abc@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 pl-10 bg-[#FFFFFF] border border-[#D8D8D8] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          {/* Mot de passe avec icône */}
          <div className="relative mb-[14px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <LockIcon size={20} className="text-gray-400" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pl-10 bg-[#FFFFFF] border border-[#D8D8D8] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {/* Mot de passe oublié */}
          <div className="w-full mb-[8px] text-right">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Mot de passe oublié ?
            </a>
          </div>
          {/* Se souvenir de moi */}
          <div className="w-full flex justify-center items-center mb-4 space-x-2">
            <label htmlFor="remember" className="flex items-center cursor-pointer select-none">
              <div className="relative" style={{ width: '32.3px', height: '19px' }}>
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-full h-full rounded-full transition-colors duration-200 border-2 border-[#E7E3E3] ${rememberMe ? 'bg-[#4976E7] border-[#4976E7]' : 'bg-[#F9F9F9] border-[#E7E3E3]'}`}></div>
                <div className={`absolute top-[2px] left-[2px] transition-all duration-200 rounded-full ${rememberMe ? 'translate-x-[13.3px] bg-white' : 'bg-[#4976E7]'} w-[15px] h-[15px]`}></div>
              </div>
              <span className="ml-3 text-sm text-gray-800">Se souvenir de moi</span>
            </label>
          </div>
          {/* Boutons */}
          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="submit"
              className="w-full mb-[11px] border border-[#4069E1] text-[#4069E1] font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              CONNEXION
            </button>
            <a
              href="/signup"
              className="w-full text-center border border-blue-600 text-[#4069E1] font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              INSCRIPTION
            </a>
          </div>
          {message && (
            <p className="text-red-500 text-center font-medium mt-3">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
