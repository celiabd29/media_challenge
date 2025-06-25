'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import emotionsImg from '../assets/img/emotions.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setMessage("❌ Identifiants incorrects");
      return;
    }
    const user = authData.user;
    if (!user) {
      setMessage("❌ L'utilisateur n'a pas été trouvé.");
      return;
    }
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      setMessage("❌ Session expirée ou problème d'authentification.");
      return;
    }
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (userError || !userData) {
      setMessage("❌ Impossible de récupérer le rôle utilisateur.");
      return;
    }
    setRole(userData.role);
  };

  useEffect(() => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Illustration */}
      <div className="h-16 w-16 mb-6">
        <Image
          src={emotionsImg}
          alt="Illustration"
          width={64}
          height={64}
          className="object-cover"
        />
      </div>

      {/* Titre */}
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-medium text-gray-900">Bienvenue</h1>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 pl-10 bg-[#F6F6F6] border border-[#D8D8D8] rounded-[8px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-gray-900"
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
            <path
              d="M15.5548 9.34437V7.37629C15.5548 5.07271 13.6866 3.20454 11.383 3.20454C9.07943 3.19446 7.20393 5.05346 7.19385 7.35796V7.37629V9.34437"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.8762 20.1627H7.872C5.9525 20.1627 4.396 18.6071 4.396 16.6867V12.7551C4.396 10.8347 5.9525 9.27908 7.872 9.27908H14.8762C16.7957 9.27908 18.3522 10.8347 18.3522 12.7551V16.6867C18.3522 18.6071 16.7957 20.1627 14.8762 20.1627Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.3743 13.703V15.7389"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pl-10 bg-[#F6F6F6] border border-[#D8D8D8] rounded-[8px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-gray-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {/* <EyeOff size={20} /> or <Eye size={20} /> */}
          </button>
        </div>

        {/* Mot de passe oublié & se souvenir */}
        <div className="flex flex-col w-full space-y-4">
          <div className="flex justify-start">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <div className="flex justify-end items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-800">
              Se souvenir de moi
            </label>
          </div>
        </div>

        {/* Boutons */}
        <button
          type="submit"
          className="w-full mb-[11px] bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          CONNEXION
        </button>
        <button className="w-full border border-blue-600 text-blue-600 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          <a href="/signup" className="hover:underline">
            INSCRIPTION
          </a>
        </button>

        {/* Message d'erreur */}
        {message && (
          <p className="text-red-500 text-center text-sm font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}