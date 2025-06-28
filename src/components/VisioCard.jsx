"use client";
import { Calendar, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import Image from "next/image";
import useFavoris from "@/hooks/useFavoris";
import Popup from "@/components/Popup";
import { useState } from "react";

export default function VisioCard({ visio }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { isFavori, toggleFavori } = useFavoris("visios", visio.id);

  const handleJoin = () => {
    const now = new Date();
    const visioDate = new Date(`${visio.date}T${visio.hour}`);
    if (now < visioDate) {
      setPopupMessage("La visioconférence n’a pas encore commencé. Revenez à l’heure prévue !");
      setShowPopup(true);
    } else {
      window.open(visio.room_url, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
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
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">{visio.titre}</h2>
        <p className="text-sm text-gray-700 mb-4">{visio.description}</p>

        <button
          onClick={handleJoin}
          className="block text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 w-full"
        >
          Rejoindre
        </button>
      </div>

      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
}
