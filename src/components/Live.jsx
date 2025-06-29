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
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push("/recherche")}
          className={`p-2 rounded-full shadow-xl ${darkMode ? 'bg-[#1E293B]' : 'bg-white'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke={darkMode ? "white" : "currentColor"} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={`ml-2 text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Visioconférences
</h1>
</div>
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
