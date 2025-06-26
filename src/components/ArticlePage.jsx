"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import Link from "next/link"; // n'oublie pas ça !

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setArticle(data);
    };
    if (id) fetchArticle();
  }, [id]);

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 bg-white min-h-screen text-gray-800">
      {article.image_url && (
        <img
          src={article.image_url}
          alt="Article"
          className="rounded-xl mb-6 w-full object-cover max-h-[260px]"
        />
      )}
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      <div className="space-y-4 text-base leading-relaxed">
        {article.content.split("\n").map((para, i) => (
          <p key={i}>
            {para.trim().startsWith("*") ? (
              <strong>{para.replace("*", "").trim()}</strong>
            ) : (
              para
            )}
          </p>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href={`/quiz?id=${article.id}`}
          className="mt-6 inline-block w-full text-center bg-pink-100 text-pink-800 font-semibold py-3 rounded-lg shadow hover:bg-pink-200 transition"
        >
          Effectuez le quiz
        </Link>
      </div>
    </div>
  );
}
