"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useDarkMode } from '@/contexts/DarkModeContext';

import { Edit3 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const { data: a } = await supabase.from("articles").select("*");
      const { data: v } = await supabase.from("videos").select("*");
      const { data: p } = await supabase.from("podcasts").select("*");

      setArticles(a || []);
      setVideos(v || []);
      setPodcasts(p || []);
    };

    fetchContent();
  }, []);

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
        .select("id, nom, email, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error.message);
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [router]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Erreur lors de l’upload 😞");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (!updateError) {
      setUser((prev) => ({ ...prev, avatar_url: publicUrl }));
      setToastMessage("✅ Avatar mis à jour !");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

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
      if (table === "articles") setArticles((prev) => prev.filter((a) => a.id !== id));
      if (table === "videos") setVideos((prev) => prev.filter((v) => v.id !== id));
      if (table === "podcasts") setPodcasts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className={`${darkMode ? 'bg-[#121212]' : 'bg-[#F5F7FB]'} min-h-screen p-4`}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {toastMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
            {toastMessage}
          </div>
        )}

        {/* Bloc Profil */}
        <div className={`rounded-2xl shadow p-6 flex flex-col items-center ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
          <div className="relative group">
            <img
              src={user?.avatar_url || "/avatar-placeholder.png"}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow mb-4"
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white dark:bg-gray-300 rounded-full p-1 border cursor-pointer hover:bg-gray-100">
              <Edit3 size={16} className="text-gray-700" />
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <h2 className="text-xl font-semibold">{user?.nom || "Chargement..."}</h2>
          <p className="text-sm opacity-70">{user?.email || ""}</p>

          <div className="w-full mt-6 mb-6 space-y-4">
          <div>
  <label className="text-sm opacity-70">Mot de passe</label>
  <input
    type="password"
    value="password"
    readOnly
    className={`w-full mt-1 p-2 mb-6 border rounded cursor-not-allowed
    ${darkMode ? 'bg-[#1E293B] text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}
  `}/>
</div>


            <DarkModeToggle />

            <button
  onClick={handleLogout}
  className={`w-full text-center py-2 rounded transition font-medium ${
    darkMode
      ? 'bg-[#0F172A] text-blue-400 border border-blue-500 hover:bg-blue-900'
      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
  }`}
>
  Déconnexion
</button>

          </div>
        </div>

        {/* Bloc Publier */}
        <div className={`rounded-2xl shadow p-6 ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
  <h3 className="text-lg font-semibold mb-4">Publier du contenu</h3>
  <div className="flex flex-col gap-4">
    {[
      { label: "Publier un article", href: "/publier/article", icon: "📄" },
      { label: "Publier une vidéo", href: "/publier/video", icon: "📹" },
      { label: "Publier un podcast", href: "/publier/podcast", icon: "🎧" },
    ].map(({ label, href, icon }) => (
      <button
        key={href}
        className={`flex items-center justify-between border rounded p-3 transition ${
          darkMode
            ? 'bg-[#0F172A] border-gray-600 text-white hover:bg-gray-800'
            : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => router.push(href)}
      >
        <span className="flex items-center gap-2">
          <span className={`${darkMode ? 'bg-blue-800' : 'bg-blue-100'} p-2 rounded-full`}>
            {icon}
          </span>
          <span className="text-sm font-medium">{label}</span>
        </span>
        <span className="text-blue-600">→</span>
      </button>
    ))}
  </div>
</div>


        {/* Bloc Gérer les contenus */}
        <div className={`rounded-2xl shadow pb-18 p-6 ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
  <h3 className="text-lg font-semibold mb-4">Mes contenus</h3>
  <div className="space-y-6">
    {[
      { title: "Articles", items: articles, type: "article", table: "articles" },
      { title: "Vidéos", items: videos, type: "video", table: "videos" },
      { title: "Podcasts", items: podcasts, type: "podcast", table: "podcasts" },
    ].map(({ title, items, type, table }) => (
      <div key={type}>
        <h4 className="text-sm font-semibold mb-2">{title}</h4>
        {items.length === 0 ? (
          <p className="text-sm opacity-70">Aucun {title.toLowerCase()} publié.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`border rounded p-4 flex flex-col gap-2 transition ${
                darkMode ? 'bg-[#1e293b] border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}
            >
              <span className="font-medium">{item.title}</span>
              <div className="flex gap-3">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => router.push(`/modifier/${type}/${item.id}`)}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => handleDelete(table, item.id)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    ))}
  </div>
</div>


      </div>
    </div>
  );
}
