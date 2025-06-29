"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabaseClient";
import { useDarkMode } from "../contexts/DarkModeContext";


export default function PublierArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useDarkMode();


  // Charger les catégories depuis la BDD
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Erreur fetch categories :", error.message);
      } else {
        console.log("Catégories récupérées :", data);
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;

      if (image) {
        const ext = image.name.split(".").pop();
        const filePath = `articles/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, image);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Utilisateur non connecté");

      const { error: insertError } = await supabase.from("articles").insert({
        title,
        content,
        description,
        image_url: imageUrl,
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
    <div className={`min-h-screen px-4 pt-6 pb-24 ${darkMode ? 'bg-[#121212] text-white' : 'bg-white text-gray-800'}`}>
      <button
        onClick={() => router.back()}
        className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
      >
        ‹
      </button>
  
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
  Publier un article
</h1>

      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Renseigner les éléments suivants :</p>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="text-sm mt-2 block">Titre</label>
          <input
            type="text"
            placeholder="Écrivez-ici"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg ${darkMode ? 'bg-[#1E293B] text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300'}`}
            required
          />
        </div>
  
        {/* Description */}
        <div>
          <label className="text-sm mt-2 block">Description</label>
          <input
            type="text"
            placeholder="Écrivez-ici"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg ${darkMode ? 'bg-[#1E293B] text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300'}`}
          />
        </div>
  
        {/* Corps */}
        <div>
          <label className="text-sm mt-2 block">Corps de texte</label>
          <textarea
            placeholder="Écrivez-ici"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg h-32 ${darkMode ? 'bg-[#1E293B] text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300'}`}
            required
          />
        </div>
  
        {/* Image */}
        <div>
          <label className="text-sm">Image de couverture</label>
          <div className={`border border-dashed rounded-lg mt-2 p-4 text-center cursor-pointer ${darkMode ? 'border-gray-500' : 'border-gray-400'}`}>
            <label className="cursor-pointer">
              <div className={`text-sm ${darkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}`}>
                Cliquez ici pour sélectionner le fichier
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Formats : PDF, JPG, PNG ou GIF – 3 Mo max.
            </p>
          </div>
        </div>
  
        {/* Catégorie */}
        <div>
          <label className="text-sm mt-2 block">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg ${darkMode ? 'bg-[#1E293B] text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300'}`}
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
          className={`w-full py-3 mt-3 rounded-lg font-medium transition ${
            darkMode
              ? 'bg-blue-700 hover:bg-blue-800 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? "Publication..." : "Publier"}
        </button>
  
        <button
          type="button"
          onClick={() => router.back()}
          className={`w-full border py-3 mt-2 rounded-lg font-medium ${
            darkMode
              ? 'border-blue-400 text-blue-400 hover:bg-[#1E293B]'
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          Annuler
        </button>
      </form>
    </div>
  );
        }  