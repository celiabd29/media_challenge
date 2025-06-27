'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import Link from "next/link";
import NavShare from "./NavShare";

import Image from "next/image";

import ecouteImg from "../assets/img/ecoute2.png"

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState(null);
  const router = useRouter();

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
    <div className="w-full bg-white pb-20 min-h-screen text-gray-800">
      {article.image_url && (
        <div className="relative">
          {/* Boutons retour et favoris superposés */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white rounded-full shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => console.log('bookmark')}
              className="p-2 bg-white rounded-full shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
              </svg>
            </button>
          </div>
          <img
            src={article.image_url}
            alt="Article"
            className="rounded-b-xl mb-6 w-full object-cover max-h-[260px] md:max-h-[400px] lg:max-h-[500px]"
          />
        </div>
      )}
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:px-8">{article.title}</h1>

      <div className="px-4 md:px-0 pb-3.5 text-sm md:text-lg md:px-8 leading-relaxed">
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

      <div className="md:px-8">
        <Link href="/quiz" className="block px-4 md:px-0">
          <div className="flex items-center bg-[#E9C4DE] h-[89px] md:h-[120px] rounded-[8px] px-4 md:px-8 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <Image
                src={ecouteImg}
                alt="Illustration quiz"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            
            <span className="ml-4 flex-1 text-white font-medium md:text-xl">
              Effectuez le quiz
            </span>
            
            <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
      <NavShare />
    </div>
  );
}
