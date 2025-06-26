import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export function ArticleForm({ onArticleCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setLoading(true);
    try {
      const fileExt = image.name.split(".").pop();
      const filePath = `articles/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("articles")
        .getPublicUrl(filePath);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Utilisateur non authentifié");
      }

      console.log("🧪 Utilisateur connecté :", user?.id);

      const { error: insertError } = await supabase.from("articles").insert({
        title,
        content,
        image_url: urlData.publicUrl,
        category,
        author_id: user.id,
      });

      if (insertError) {
        console.log("⚠️ insertError:", insertError);
        throw insertError;
      }

      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setError("");
      onArticleCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Catégorie</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium"
      >
        {loading ? "Création en cours..." : "Créer l’article"}
      </button>
    </form>
  );
}
