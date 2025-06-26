"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

function ArticleForm({ onArticleCreated, articleToEdit, clearEdit }) {
  const [title, setTitle] = useState(articleToEdit?.title || "");
  const [content, setContent] = useState(articleToEdit?.content || "");
  const [category, setCategory] = useState(articleToEdit?.category || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setCategory(articleToEdit.category);
    }
  }, [articleToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = articleToEdit?.image_url || null;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const filePath = `articles/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, image);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;

      if (articleToEdit) {
        const { error: updateError } = await supabase
          .from("articles")
          .update({ title, content, category, image_url: imageUrl })
          .eq("id", articleToEdit.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("articles").insert({
          title,
          content,
          image_url: imageUrl,
          category,
          author_id: userId,
        });
        if (insertError) throw insertError;
      }

      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      setError("");
      onArticleCreated();
      clearEdit();
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
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium"
      >
        {loading
          ? articleToEdit
            ? "Modification..."
            : "Création..."
          : articleToEdit
          ? "Modifier l’article"
          : "Créer l’article"}
      </button>
      {articleToEdit && (
        <button
          onClick={clearEdit}
          type="button"
          className="ml-4 text-gray-600 underline"
        >
          Annuler la modification
        </button>
      )}
    </form>
  );
}

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const router = useRouter();

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setArticles(data);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, email, nom, role")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        console.error("Erreur lors du chargement :", error.message);
      } else {
        setUserData(data);
        if (data.role === "admin") {
          fetchUsers();
          fetchMessages();
          fetchArticles();
        }
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nom, email, role");
      if (!error) setUsersList(data);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (!error) setMessages(data);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteArticle = async (id) => {
    await supabase.from("articles").delete().eq("id", id);
    fetchArticles();
  };

  return (
    <ProtectedRoute roleRequired="admin">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenue, {userData?.nom || "utilisateur"} 👋
          </h1>
          <p className="text-gray-700 text-base mb-1">
            📧 {userData?.email || "email inconnu"}
          </p>
          <p className="text-gray-700 text-base mb-6">
            🔐 Rôle : {userData?.role || "non défini"}
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium"
          >
            Se déconnecter
          </button>
        </div>

        {userData?.role === "admin" && (
          <div className="mt-10 w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              👥 Utilisateurs
            </h2>
            <ul className="mb-6">
              {usersList.map((u) => (
                <li key={u.id} className="mb-2 border-b pb-2">
                  <p className="text-gray-700">
                    {u.nom} – {u.email} ({u.role})
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              💬 Messages
            </h2>
            <ul>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <li key={msg.id} className="mb-2 border-b pb-2">
                    <p className="text-gray-700">{msg.contenu}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Aucun message</p>
              )}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📝 Articles
            </h2>
            <button
              onClick={() => {
                setShowArticleForm(!showArticleForm);
                setArticleToEdit(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium mb-4"
            >
              {showArticleForm ? "Annuler" : "Créer un article"}
            </button>

            {showArticleForm && (
              <ArticleForm
                onArticleCreated={fetchArticles}
                articleToEdit={articleToEdit}
                clearEdit={() => setArticleToEdit(null)}
              />
            )}

            <ul>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <li key={article.id} className="mb-4 border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {article.title}
                    </h3>
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-32 h-32 object-cover rounded-md mt-2"
                      />
                    )}
                    <p className="text-gray-700 mt-2">{article.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Catégorie : {article.category}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Créé le :{" "}
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setArticleToEdit(article)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Aucun article</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
