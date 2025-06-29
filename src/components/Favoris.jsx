"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import CardFavori from "../components/CardFavori";
import BottomNavbar from "./BottomNavbar";

export default function Favoris() {
  const [selectedTab, setSelectedTab] = useState("Tout");
  const [query, setQuery] = useState("");
  const [articleFavoris, setArticleFavoris] = useState([]);
  const [videoFavoris, setVideoFavoris] = useState([]);
  const [podcastFavoris, setPodcastFavoris] = useState([]);

  useEffect(() => {
    const fetchFavoris = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) return;

      const { data: a } = await supabase
        .from("favoris_articles")
        .select("*, articles(*)")
        .eq("user_id", uid);

      const { data: v } = await supabase
        .from("favoris_videos")
        .select("*, videos(*)")
        .eq("user_id", uid);

      const { data: p } = await supabase
        .from("favoris_podcasts")
        .select("*, podcasts(*)")
        .eq("user_id", uid);

      setArticleFavoris(a ?? []);
      setVideoFavoris(v ?? []);
      setPodcastFavoris(p ?? []);
    };

    fetchFavoris();
  }, []);

  const renderCards = () => {
    const cards = [];

    if (selectedTab === "Tout" || selectedTab === "Article") {
      cards.push(...articleFavoris.map((f) => (
        <CardFavori
          key={f.id}
          type="Article"
          title={f.articles.title}
          description={f.articles.description}
          image={f.articles.image_url}
          duration={f.articles.duration}
          likes={f.articles.likes}
          href={`/article/${f.article_id}`}
        />
      )));
    }

    if (selectedTab === "Tout" || selectedTab === "Vidéo") {
      cards.push(...videoFavoris.map((f) => (
        <CardFavori
          key={f.id}
          type="Vidéo"
          title={f.videos.title}
          description={f.videos.description}
          image={f.videos.image_url}
          duration={f.videos.duration}
          likes={f.videos.likes}
          href={`/video/${f.video_id}`}
        />
      )));
    }

    if (selectedTab === "Tout" || selectedTab === "Podcast") {
      cards.push(...podcastFavoris.map((f) => (
        <CardFavori
          key={f.id}
          type="Podcast"
          title={f.podcasts.title}
          description={f.podcasts.description}
          image={f.podcasts.image_url}
          duration={f.podcasts.duration}
          likes={f.podcasts.likes}
          href={`/podcast/${f.podcast_id}`}
        />
      )));
    }

    return cards;
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En-tête */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-black font-medium text-2xl md:text-3xl leading-6">Mes Favoris</h1>
      </header>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="🔍 Recherche"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-xl border text-sm placeholder-gray-400"
      />

      {/* Onglets type */}
      <div className="flex gap-2 mb-6">
        {["Tout", "Article", "Vidéo", "Podcast"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cartes de favoris */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCards().filter((card) =>
          card.props.title.toLowerCase().includes(query.toLowerCase())
        )}
      </section>

      <BottomNavbar />
    </div>
  );
}
