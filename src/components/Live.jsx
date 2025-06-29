"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import VisioCard from "@/components/VisioCard";
import { useDarkMode } from "../contexts/DarkModeContext";


export default function Visios() {
  const [visios, setVisios] = useState([]);
  const { darkMode } = useDarkMode();

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
    <div className={`flex flex-col min-h-screen pb-20 px-4 py-6 ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
      <header className="flex items-center justify-between mb-4">
        <h1 className={`font-medium text-2xl md:text-3xl leading-6 ${darkMode ? 'text-white' : 'text-black'}`}>
          Visioconférences
        </h1>
      </header>
      <h2 className={`text-lg font-semibold text-start mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Nos prochaines visioconférences
      </h2>
      <p className={`text-start mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Retrouvez ici toutes les visioconférences proposées par nos experts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mb-18">
  {visios.map((visio) => (
    <VisioCard key={visio.id} visio={visio} />
  ))}
</div>

    </div>
  );

}
