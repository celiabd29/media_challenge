"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabaseClient";

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
    <div className="min-h-screen bg-white px-4 pt-6 pb-24">
      <button
        onClick={() => router.back()}
        className="text-xl mb-4 text-gray-600"
      >
        ‹
      </button>

      <h1 className="text-2xl font-bold mb-6">Publier un article</h1>
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
            className="w-full mt-1 p-3 border rounded-lg text-gray-600"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600 mt-2 ">Description</label>
          <input
            type="text"
            placeholder="Écrivez-ici"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg text-gray-600"
          />
        </div>

        {/* Corps */}
        <div>
          <label className="text-sm text-gray-600 mt-2">Corps de texte</label>
          <textarea
            placeholder="Écrivez-ici"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg h-32 text-gray-600"
            required
          />
        </div>

        {/* Image */}
        <div>
  <label className="text-sm text-gray-600">Image de couverture</label>
  <div className="border border-dashed border-gray-400 rounded-lg mt-2 p-4 text-center cursor-pointer">
    <label className="cursor-pointer">
      <div className="text-sm text-blue-600 hover:underline">
        Cliquez ici pour sélectionner le fichier
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="hidden"
      />
    </label>
    <p className="text-xs text-gray-400 mt-1">
      Formats : PDF, JPG, PNG ou GIF – 3 Mo max.
    </p>
  </div>
</div>


        {/* Catégorie */}
        <div>
          <label className="text-sm text-gray-600 mt-2">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg text-gray-600"
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
