import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export function ArticleList({ onArticleSelected }) {
  const [articles, setArticles] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      setUserId(sessionData?.user?.id);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setArticles(data);
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📰 Articles</h2>
      {articles.map((article) => (
        <div
          key={article.id}
          className="mb-4 p-4 bg-white rounded shadow border relative"
        >
          <h3 className="text-lg font-bold mb-1">{article.title}</h3>
          <img
            src={article.image_url}
            alt=""
            className="w-full max-h-52 object-cover mb-2 rounded"
          />
          <p className="text-sm text-gray-600">
            Catégorie : {article.category}
          </p>
          <p className="text-sm text-gray-500">
            Créé le : {new Date(article.created_at).toLocaleDateString()}
          </p>

          {article.author_id === userId && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDelete(article.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                Supprimer
              </button>
              <button
                onClick={() => onArticleSelected(article)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Modifier
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
