"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Popup from "@/components/Popup";


export default function Visios() {
  const [visios, setVisios] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState("");


  useEffect(() => {
    const fetchVisios = async () => {
      const { data, error } = await supabase.from("visios").select("*").order("date", { ascending: true });
      if (!error) setVisios(data);
    };
    fetchVisios();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold mb-1 text-start">Visioconférences</h1>
      <h2 className="text-lg font-semibold text-start mb-2 text-gray-800">Nos prochaines visioconférences</h2>
      <p className="text-start text-gray-600 mb-6">
        Retrouvez ici toutes les visioconférences proposées par nos experts.
      </p>

      <div className="space-y-6">
        {visios.map((visio) => (
          <div key={visio.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {visio.image_url && (
              <Image
              src={visio.image_url}
              alt={visio.titre || "Image de la visioconférence"}
              width={600}
              height={300}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            
            )}

            <div className="p-4">
              <div className="flex items-center gap-4 text-blue-600 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{visio.hour?.slice(0, 5)}</span>

                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    {new Date(visio.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-1">{visio.titre}</h2>
              <p className="text-sm text-gray-700 mb-4">{visio.description}</p>

              <button
  onClick={() => {
    const now = new Date();
    const visioDate = new Date(`${visio.date}T${visio.hour}`);
    if (now < visioDate) {
      setPopupMessage("La visioconférence n’a pas encore commencé. Revenez à l’heure prévue !");
      setShowPopup(true);
    } else {
      window.open(visio.room_url, "_blank");
    }
  }}
  className="block text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 w-full"
>
  Rejoindre
</button>


            </div>
          </div>
        ))}
        {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}

      </div>
    </div>
  );
}
