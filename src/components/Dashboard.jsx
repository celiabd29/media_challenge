"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("nom, email, age")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur chargement user :", error.message);
      } else {
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user, router]);

  if (!userData) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {userData.nom} 👋</h1>
      <p>Email : {userData.email}</p>
      <p>Âge : {userData.age} ans</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
