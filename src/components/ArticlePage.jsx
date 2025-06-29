'use client';

import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import ecouteImg from "../assets/img/ecoute2.png";

export default function ArticlePage({ id }) {
  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Article
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (articleError) {
        console.error("Erreur article :", articleError);
        return;
      }
      setArticle(articleData);

      // Utilisateur
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) return;

      const uid = userData.user.id;
      setUserId(uid);

      // Vérifie si déjà liké
      const { data: likeData, error: likeCheckError } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", uid)
        .eq("content_id", id)
        .eq("content_type", "article");

      if (!likeCheckError) setLiked(likeData?.length > 0);

      // Récupère le nombre de likes
      const { data: countData, error: countError } = await supabase
        .from("article_like_counts")
        .select("like_count")
        .eq("content_id", id)
        .single();

      if (!countError) {
        setLikeCount(countData?.like_count || 0);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleLike = async () => {
    if (!userId || !id) return;

    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", id)
        .eq("content_type", "article");

      if (error) {
        console.error("Suppression like :", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ user_id: userId, content_id: id, content_type: "article" }]);

      if (error) {
        console.error("Ajout like :", error);
        return;
      }
    }

    setLiked(!liked);

    // Met à jour le compteur
    const { data: countData, error: countError } = await supabase
      .from("article_like_counts")
      .select("like_count")
      .eq("content_id", String(id))
      .maybeSingle();

    if (!countError) {
      setLikeCount(countData?.like_count || 0);
    }
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-white text-gray-800 px-4">
      <div className="p-4">
  <button
    onClick={() => router.back()}
    className="p-2 bg-white rounded-full shadow-xl"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-800"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</div>

{article.image_url && (
  <div className="w-full h-[240px] relative mb-6">
    <Image
      src={article.image_url}
      alt="Article"
      fill
      className="object-cover w-full h-full rounded-b-xl"
    />
  </div>
)}



      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <button onClick={handleToggleLike}>
          <Heart fill={liked ? "red" : "none"} color="red" />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">{likeCount} ❤️</p>

      <div className="space-y-4 text-base leading-relaxed">
        {article.content?.split("\n").map((para, i) => (
          <p key={i}>
            {para.trim().startsWith("*") ? (
              <strong>{para.replace("*", "").trim()}</strong>
            ) : (
              para
            )}
          </p>
        ))}
      </div>

      <div className="mt-10 pb-18">
        <Link href="/quiz">
          <div className="flex items-center bg-[#E9C4DE] h-[89px] rounded-[8px] px-4 shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={ecouteImg}
              alt="Illustration quiz"
              width={100}
              height={100}
              className="object-cover"
            />
            <span className="ml-4 flex-1 text-white font-medium">
              Effectuez le quiz
            </span>
            <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
