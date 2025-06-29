"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabase/supabaseClient";
import NavShare from "./NavShare";
import { Heart } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import quizImg from '../assets/img/emotion2.png'

export default function Video({ videoId }) {

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [video, setVideo] = useState(null);

  const videoRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1000);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    hideControlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
  };

  const toggleLike = async () => {
    if (!userId || !videoId) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", videoId)
        .eq("content_type", "video");
    } else {
      await supabase.from("likes").insert([
        { user_id: userId, content_id: videoId, content_type: "video" },
      ]);
    }

    setLiked(!liked);
    fetchLikeCount();
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("content_id", videoId)
      .eq("content_type", "video");

    setLikeCount(count || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: videoData, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();
  
      if (!error) {
        setVideo(videoData);
      } else {
        console.error("Erreur récupération vidéo :", error);
      }
    };
  
    if (videoId) fetchData();
  }, [videoId]);
  

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      setUserId(uid);

      if (uid && videoId) {
        const { data: like } = await supabase
          .from("likes")
          .select("*")
          .eq("user_id", uid)
          .eq("content_id", videoId)
          .eq("content_type", "video");

        setLiked(Array.isArray(like) && like.length > 0);
        fetchLikeCount();
      }
    };

    init();
  }, [videoId]);

  return (
    <main className="min-h-screen bg-white pb-20 w-full">
      {/* Vidéo */}
      <div
        className="relative w-full h-[200px] md:h-[400px] lg:h-[500px] rounded-bl-xl rounded-br-xl overflow-hidden bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {video?.video_url && (
  <video
    ref={videoRef}
    src={video.video_url}
    poster={video.image_url || undefined}
    className="w-full h-[200px] md:h-[400px] lg:h-[500px] object-cover cursor-pointer"
    onClick={togglePlay}
    onPlay={handlePlay}
    onPause={handlePause}
    preload="metadata"
  >
    Votre navigateur ne supporte pas la lecture de vidéos.
  </video>
)}


        {/* Contrôles */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              <button onClick={toggleLike} className="p-3 bg-white rounded-full shadow-xl">
                <Heart fill={liked ? "red" : "none"} color="red" />
              </button>

              <BookmarkButton
                contentId={videoId}
                contentType="video"
                title={video?.title || ""}
                description={video?.description || ""}
                image_url={video?.image_url || ""}
                duration="5min"
              />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-pink-200/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
            >
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-6 px-4 md:px-4">
        <h1 className="text-2xl md:text-4xl font-semibold text-black">
          {video?.title || "Titre de la vidéo"}
        </h1>
        <p className="mt-2 text-gray-700 text-sm md:text-lg leading-relaxed">
          {video?.description || "Cette vidéo aborde un sujet avec simplicité et bienveillance."}
        </p>
        <p className="mt-2 text-gray-500 text-sm">{likeCount} ❤️</p>
      </section>

      {/* Quiz */}
      <Link href="/quiz" className="mt-6 block px-4 md:px-4">
        <div className="flex items-center bg-[#E9C4DE] h-[89px] md:h-[120px] rounded-[8px] px-4 md:px-8 shadow-sm hover:shadow-md transition-shadow">
          <div>
          <Image
  src={quizImg}
  alt="Illustration quiz"
  width={100}
  height={100}
  className="object-cover"
/>

          </div>
          <span className="ml-4 flex-1 text-white font-medium md:text-xl">Effectuez le quiz</span>
          <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>

      <NavShare query={query} setQuery={setQuery} />
    </main>
  );
}
