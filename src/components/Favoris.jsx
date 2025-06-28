"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import NavigationFavoris from "../components/NavFavoris";
import Image from "next/image";
import Link from "next/link";

export default function Favoris() {
  const [selectedTab, setSelectedTab] = useState("Tout");
  const [query, setQuery] = useState("");
  const [videoFavoris, setVideoFavoris] = useState([]);

  useEffect(() => {
    const fetchVideoFavoris = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("favoris_videos")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erreur récupération vidéos :", error);
      } else {
        setVideoFavoris(data);
      }
    };

    fetchVideoFavoris();
  }, []);

  const filteredVideos = videoFavoris.filter((video) =>
    video.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4">Mes Favoris</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Recherche..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border bg-gray-100"
        />
      </div>

      {/* Navigation */}
      <NavigationFavoris selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* Contenu */}
      {(selectedTab === "Vidéo" || selectedTab === "Tout") && filteredVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white border rounded-xl shadow-md overflow-hidden">
              <Link href={`/video/${video.video_id}`}>
                <div className="cursor-pointer">
                  <Image
                    src={video.image_url}
                    alt={video.title}
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{video.title}</h2>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {(selectedTab === "Vidéo" || selectedTab === "Tout") && filteredVideos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Aucun favori pour le moment.</p>
      )}
    </main>
  );
}
