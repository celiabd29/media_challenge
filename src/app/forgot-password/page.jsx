"use client";
import React, { useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { MailIcon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
      //     redirectTo:
      // process.env.NEXT_PUBLIC_SITE_URL + "/reset-password",
    });

    if (error) {
      setMessage("❌ Erreur : " + error.message);
    } else {
      setMessage("📧 Un email de réinitialisation a été envoyé !");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Mot de passe oublié
      </h1>
      <p className="text-sm text-gray-600 mb-6">Entre ton adresse email :</p>

      <form
        onSubmit={handleReset}
        className="w-full max-w-sm bg-gray-50 rounded-xl space-y-4"
      >
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

        <div className="flex flex-col space-y-3 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
          >
            RÉINITIALISER
          </button>
          <a
            href="/login"
            className="w-full text-center mt-2 border-2 border-blue-500 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            RETOUR
          </a>
        </div>

        {message && (
          <p className="text-red-500 text-center font-medium mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
