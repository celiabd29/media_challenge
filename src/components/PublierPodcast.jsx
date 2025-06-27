"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabaseClient";

export default function PublierPodcast() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (!error) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      let audioUrl = null;

      if (image) {
        const ext = image.name.split(".").pop();
        const path = `podcasts/${Date.now()}_cover.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("podcasts")
          .upload(path, image);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("podcasts").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      if (audio) {
        const ext = audio.name.split(".").pop();
        const path = `podcasts/${Date.now()}_audio.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("podcasts")
          .upload(path, audio);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("podcasts").getPublicUrl(path);
        audioUrl = data.publicUrl;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Utilisateur non connecté");

      const { error: insertError } = await supabase.from("podcasts").insert({
        title,
        description,
        image_url: imageUrl,
        audio_url: audioUrl,
        category_id: category,
        author_id: user.id,
      });

      if (insertError) throw insertError;

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-24">
      <button
        onClick={() => router.back()}
        className="text-xl mb-4 text-gray-600"
      >
        ‹
      </button>

      <h1 className="text-2xl font-bold mb-6">Publier un podcast</h1>
      <p className="text-gray-600 mb-4">Renseigner les éléments suivants :</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="text-sm text-gray-600 mt-2">Titre</label>
          <input
            type="text"
            placeholder="Écrivez-ici"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg placeholder-gray-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600 mt-2">Description</label>
          <input
            type="text"
            placeholder="Écrivez-ici"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg placeholder-gray-400"
          />
        </div>

        {/* Image de couverture */}
        <div>
          <label className="text-sm text-gray-600">Image de couverture</label>
          <div className="border border-dashed border-gray-400 rounded-lg mt-2 p-4 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full"
            />
            <p className="text-sm mt-2 text-gray-500">
              Cliquez ici pour sélectionner le fichier
            </p>
            <p className="text-xs text-gray-400">
              Formats : PDF, JPG, PNG ou GIF – 3 Mo max.
            </p>
          </div>
        </div>

        {/* Fichier audio */}
        <div>
          <label className="text-sm text-gray-600">Fichier audio</label>
          <div className="border border-dashed border-gray-400 rounded-lg mt-2 p-4 text-center cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files?.[0] || null)}
              className="w-full"
            />
            <p className="text-sm mt-2 text-gray-500">
              Cliquez ici pour sélectionner le fichier
            </p>
            <p className="text-xs text-gray-400">
              Formats : MP3, WAV, AAC – 10 Mo max.
            </p>
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="text-sm text-gray-600 mt-2">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Erreur */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Boutons */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 mt-3 rounded-lg font-medium hover:bg-blue-700"
        >
          {loading ? "Publication..." : "Publier"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full border border-blue-600 text-blue-600 py-3 mt-2 rounded-lg font-medium"
        >
          Annuler
        </button>
      </form>
    </div>
  );
}
