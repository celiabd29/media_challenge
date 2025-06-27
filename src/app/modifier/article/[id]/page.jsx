"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/supabase/supabaseClient";

export default function ModifierArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = Number(params?.id);

  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(null); // ✅ manquant avant
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // Récupération de l'article
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error || !data) {
        console.error("Erreur fetch :", error);
        setError("Erreur de chargement");
        return;
      }

      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setContent(data.content ?? "");
      setImageUrl(data.image_url ?? "");
      setCategoryId(data.category_id ?? null); // ✅ initialisation
    };

    fetchArticle();
  }, [articleId]);

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (!error) {
        setCategoryList(data);
      } else {
        console.error("Erreur de chargement des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (imageFile && !imageFile.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `article-${articleId}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });

      if (uploadError) {
        console.error("Erreur upload image :", uploadError);
        setError("Erreur lors de l'upload de l'image");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("articles")
        .getPublicUrl(filePath);

      finalImageUrl = urlData?.publicUrl;
    }

    const selectedCategory = categoryList.find(
      (cat) => cat.id === Number(categoryId)
    );
    const categoryName = selectedCategory?.name ?? "";

    const updatePayload = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image_url: finalImageUrl ?? null,
      category_id: Number(categoryId),
      category: categoryName,
    };

    console.log("Tentative de mise à jour :", updatePayload);

    const { error: updateError } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", articleId);

    if (updateError) {
      console.error("Erreur update article :", updateError);
      setError("Erreur lors de la mise à jour");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white text-gray-900 shadow-2xl rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        📝 Modifier l'article
      </h1>

      <form onSubmit={handleUpdate} className="space-y-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu"
          className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>
              Choisir une catégorie
            </option>
            {categoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 mt-2">
            Changer l’image (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-2 rounded-lg bg-gray-50"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Image actuelle"
              className="mt-4 max-h-52 rounded-xl object-cover"
            />
          )}
        </div>

        {error && <p className="text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
