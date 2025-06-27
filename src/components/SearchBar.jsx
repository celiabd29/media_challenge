'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from "../supabase/supabaseClient";
import Link from "next/link";

export default function SearchBar({ placeholder = "Recherche..." }) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setArticles(data);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    // Fonction pour retirer les accents
    function normalize(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
    const normalizedQuery = normalize(query);
    if (normalizedQuery.trim() === "") {
      setFilteredArticles([]);
      return;
    }
    setFilteredArticles(
      articles.filter((article) => {
        const title = normalize(article.title || "");
        const content = normalize(article.content || "");
        // Chaque mot de la requête doit être présent dans le titre OU le contenu
        return normalizedQuery
          .split(" ")
          .filter(Boolean)
          .every((word) => title.includes(word) || content.includes(word));
      })
    );
  }, [query, articles]);

  return (
    <div className="relative mb-6">
      <div className="flex items-center bg-[#EDEAEA] rounded-[12px] px-4 py-4">
        {/* Icône de recherche */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          className="flex-shrink-0"
        >
          <path
            d="M12.25 21C17.4967 21 21.75 16.7467 21.75 11.5C21.75 6.25329 17.4967 2 12.25 2C7.00329 2 2.75 6.25329 2.75 11.5C2.75 16.7467 7.00329 21 12.25 21Z"
            stroke="#9C9C9C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.75 22L20.75 20"
            stroke="#9C9C9C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="ml-2 flex-1 text-sm text-[#9C9C9C] bg-transparent outline-none placeholder-[#9C9C9C]"
        />
      </div>
      {query.trim() !== "" && (
        <div className="absolute left-0 right-0 bg-white z-20 rounded-xl shadow-lg mt-1 p-2">
          <h2 className="text-black font-medium text-lg pb-2">Résultats</h2>
          {filteredArticles.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredArticles.map(article => (
                <Link
                  key={article.id}
                  href={`/article?id=${article.id}`}
                  className="block bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition"
                >
                  <h3 className="font-semibold text-black text-base">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{article.content}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun résultat.</p>
          )}
        </div>
      )}
    </div>
  )
}
