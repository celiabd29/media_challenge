'use client';

import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import BookmarkButton from '@/components/BookmarkButton';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Heart, Share } from "lucide-react";
import ecouteImg from "../assets/img/ecoute2.png";
import ShareModal from '@/components/ShareModal';


export default function ArticlePage({ id }) {
  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

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

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) return;

      const uid = userData.user.id;
      setUserId(uid);

      const { data: likeData } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", uid)
        .eq("content_id", id)
        .eq("content_type", "article");

      setLiked(likeData?.length > 0);

      const { data: countData } = await supabase
        .from("article_like_counts")
        .select("like_count")
        .eq("content_id", id)
        .single();

      setLikeCount(countData?.like_count || 0);
    };

    fetchData();
  }, [id]);

  const handleToggleLike = async () => {
    if (!userId || !id) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", id)
        .eq("content_type", "article");
    } else {
      await supabase
        .from("likes")
        .insert([{ user_id: userId, content_id: id, content_type: "article" }]);
    }

    setLiked(!liked);

    const { data: countData } = await supabase
      .from("article_like_counts")
      .select("like_count")
      .eq("content_id", String(id))
      .maybeSingle();

    setLikeCount(countData?.like_count || 0);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : '';
    navigator.clipboard.writeText(url);
    alert("Lien copié !");
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-white text-gray-800 pb-32">


      {article.image_url && (
        <div className="w-full h-[200px] md:h-[400px] lg:h-[500px] relative mb-6">
          <Image
            src={article.image_url}
            alt="Article"
            fill
            className="w-full h-[200px] md:h-[400px] lg:h-[500px] object-cover rounded-b-xl"
          />
        </div>
      )}
      <div className="absolute top-4 left-8 right-8 flex items-center justify-between z-10">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <BookmarkButton contentId={article.id} type="video" />
          </div>
<div className="px-4">
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>

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

      <div className="fixed bottom-0 left-0 w-full bg-blue-500 rounded-t-2xl px-8 py-4 flex justify-around items-center z-50 text-white">
  <div className="flex justify-center items-center">
    <BookmarkButton contentId={article.id} type="article" />
  </div>
  <button
    onClick={handleToggleLike}
    className="p-2 rounded-full hover:bg-blue-400 transition flex justify-center items-center"
    aria-label="Like"
  >
    <Heart className={`w-6 h-6 ${liked ? 'fill-white' : 'fill-none'}`} />
  </button>
  <button
  onClick={() => setShowShare(true)}
  className="p-2 rounded-full hover:bg-blue-400 transition flex justify-center items-center"
  aria-label="Partager"
>
  <Share className="w-6 h-6" />
</button>

</div>
{showShare && <ShareModal onClose={() => setShowShare(false)} />}

    </div>
  );
}
