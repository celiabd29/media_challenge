"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function EspacePro() {
  const [userData, setUserData] = useState(null);
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, nom, email, role")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        router.push("/login");
      } else {
        setUserData(data);
        fetchPatients();
      }
    };

    const fetchPatients = async () => {
      const { data } = await supabase
        .from("users")
        .select("nom, email")
        .eq("role", "utilisateur");

      setPatients(data || []);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!userData) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Espace professionnel 🩺
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Bienvenue <strong>{userData.nom}</strong> – {userData.email}
        </p>

        <button
          onClick={handleLogout}
          className="mb-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          Se déconnecter
        </button>

        <h2 className="text-xl font-semibold mb-2">
          👥 Liste des utilisateurs
        </h2>
        <ul className="space-y-2">
          {patients.map((patient, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded-md">
              <p className="text-gray-800 font-medium">{patient.nom}</p>
              <p className="text-gray-600 text-sm">{patient.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
