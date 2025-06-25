'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import emotionsImg from '../assets/img/emotions.png';
import BottomNavbar from "./BottomNavbar";

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
      <div className="h-16 w-16">
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
        <h1 className="text-2xl font-medium text-gray-900">
          Bienvenue
        </h1>
      </div>
      {/* Formulaire de connexion */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        {/* Email */}
        <div>
          <h2 className="block text-2xl font-medium text-gray-700 mb-[19px]">
            Connectez-vous
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-[14px] px-4 py-3 bg-[#FFFFFF] border border-gray-200 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-[12px] px-4 py-3 bg-[#FFFFFF] border border-gray-200 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {/* tu peux décommenter et importer Eye/EyeOff */}
              {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
            </button>
          </div>
        </div>

        {/* Se souvenir de moi & Oublié */}
        <div className="flex flex-col w-full space-y-4">
  {/* Ligne 1 : lien mot de passe oublié aligné à gauche */}
  <div className="flex justify-start">
    <a
      href="/forgot-password"
      className="text-blue-600 hover:underline text-sm"
    >
      Mot de passe oublié&nbsp;?
    </a>
  </div>

  {/* Ligne 2 : toggle & label alignés à droite */}
  <div className="flex justify-end items-center space-x-2">
    {/* Ici, tu peux remplacer par ton ToggleSwitch si tu en as un composant */}
    <input
      id="remember"
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="toggle toggle-primary"
    />
    <label htmlFor="remember" className="text-sm text-gray-800">
      Se souvenir de moi
    </label>
  </div>
</div>



        {/* Bouton */}
        <button
          type="submit"
          className="w-full mb-[14px] mt-[55px] bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          CONNEXION
        </button>
        <button
          type="submit"
          className="w-full border border-blue-600 text-blue-600 font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
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

      {/* Lien inscription */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Vous n'avez pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Inscrivez-vous !
          </a>
        </p>
      </div>
      {/* <BottomNavbar /> */}
    </div>
  );
}