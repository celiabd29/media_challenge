"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import VisioCard from "@/components/VisioCard";

export default function Visios() {
  const [visios, setVisios] = useState([]);

  useEffect(() => {
    const fetchVisios = async () => {
      const { data, error } = await supabase
        .from("visios")
        .select("*")
        .order("date", { ascending: true });
      if (!error) setVisios(data);
    };
    fetchVisios();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-1 text-start">Visioconférences</h1>
      <h2 className="text-lg font-semibold text-start mb-2 text-gray-800">
        Nos prochaines visioconférences
      </h2>
      <p className="text-start text-gray-600 mb-6">
        Retrouvez ici toutes les visioconférences proposées par nos experts.
      </p>

      <div className="space-y-6">
        {visios.map((visio) => (
          <VisioCard key={visio.id} visio={visio} />
        ))}
      </div>
    </div>
  );
}
