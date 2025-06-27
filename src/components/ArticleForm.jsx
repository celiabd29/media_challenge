import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export function ArticleForm({ onArticleCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Charger les catégories depuis Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Erreur de chargement des catégories :", error.message);
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

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

      const { error: insertError } = await supabase.from("articles").insert({
        title,
        content,
        image_url: urlData.publicUrl,
        category_id: category,
        author_id: user.id,
      });

      if (insertError) {
        console.log("⚠️ insertError:", insertError);
        throw insertError;
      }

      // Reset du formulaire
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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
