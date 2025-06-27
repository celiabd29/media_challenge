"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  // Récupérer les contenus créés par l'utilisateur
  useEffect(() => {
    const fetchContent = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const { data: a } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", userId);
      const { data: v } = await supabase
        .from("videos")
        .select("*")
        .eq("author_id", userId);
      const { data: p } = await supabase
        .from("podcasts")
        .select("*")
        .eq("author_id", userId);

      setArticles(a || []);
      setVideos(v || []);
      setPodcasts(p || []);
    };

    fetchContent();
  }, []);

  // Récupérer les infos utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("users")
        .select("nom, email")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur :",
          error.message
        );
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async (table, id) => {
    if (!confirm("Supprimer ce contenu ?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert("❌ Erreur lors de la suppression");
      console.error(error);
    } else {
      if (table === "articles")
        setArticles((prev) => prev.filter((a) => a.id !== id));
      if (table === "videos")
        setVideos((prev) => prev.filter((v) => v.id !== id));
      if (table === "podcasts")
        setPodcasts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-4 flex flex-col gap-6">
      {/* Profil utilisateur */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <img
          src="/avatar-placeholder.png"
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {user?.nom || "Chargement..."}
        </h2>
        <p className="text-gray-500 text-sm">{user?.email || ""}</p>

        <div className="w-full mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input
              type="password"
              value="password"
              readOnly
              className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed placeholder-gray-500"
            />
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Publier du contenu */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Publier du contenu
        </h3>
        <div className="flex flex-col gap-4">
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/article")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">📄</span>
              <span className="text-sm font-medium text-gray-800">
                Publier un article
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/video")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">📹</span>
              <span className="text-sm font-medium text-gray-800">
                Publier une vidéo
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
          <button
            className="flex items-center justify-between border border-gray-300 rounded p-3 hover:bg-gray-50"
            onClick={() => router.push("/publier/podcast")}
          >
            <span className="flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">🎧</span>
              <span className="text-sm font-medium text-gray-800">
                Publier un podcast
              </span>
            </span>
            <span className="text-blue-600">→</span>
          </button>
        </div>
      </div>

      {/* Gérer les contenus publiés */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Mes contenus
        </h3>
        <div className="space-y-6">
          {/* Articles */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Articles
            </h4>
            {articles.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun article publié.</p>
            ) : (
              articles.map((a) => (
                <div
                  key={a.id}
                  className="border rounded p-4 flex flex-col gap-2 bg-gray-50"
                >
                  <span className="text-gray-800 font-medium">{a.title}</span>
                  <div className="flex gap-3">
                    <button
                      className="text-sm text-blue-600"
                      onClick={() => router.push(`/modifier/article/${a.id}`)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => handleDelete("articles", a.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vidéos */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Vidéos</h4>
            {videos.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune vidéo publiée.</p>
            ) : (
              videos.map((v) => (
                <div
                  key={v.id}
                  className="border rounded p-4 flex flex-col gap-2 bg-gray-50"
                >
                  <span className="text-gray-800 font-medium">{v.title}</span>
                  <div className="flex gap-3">
                    <button
                      className="text-sm text-blue-600"
                      onClick={() => router.push(`/modifier/video/${v.id}`)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => handleDelete("videos", v.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Podcasts */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Podcasts
            </h4>
            {podcasts.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun podcast publié.</p>
            ) : (
              podcasts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded p-4 flex flex-col gap-2 bg-gray-50"
                >
                  <span className="text-gray-800 font-medium">{p.title}</span>
                  <div className="flex gap-3">
                    <button
                      className="text-sm text-blue-600"
                      onClick={() => router.push(`/modifier/podcast/${p.id}`)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => handleDelete("podcasts", p.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
