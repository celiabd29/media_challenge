"use client";
import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Étape 1 : création du compte avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(`❌ ${authError.message}`);
      return;
    }

    const user = authData.user;

    // Étape 2 : insertion dans la table "users"
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email,
      nom,
      age: parseInt(age),
    });

    if (insertError) {
      setMessage(`❌ Erreur utilisateur : ${insertError.message}`);
    } else {
      setMessage("✅ Compte créé ! Vérifie tes mails 📧");
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Créer un compte</h2>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Âge"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Créer mon compte</button>
      <p>{message}</p>
    </form>
  );
}
