"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabase/supabaseClient";
import NavShare from "./NavShare";
import ecouteImg from "../assets/img/ecoute2.png";
import { Heart } from "lucide-react";

const VIDEO_SRC = "/video/fleur.mp4";
const VIDEO_ID = 1; // À adapter dynamiquement si besoin

export default function Video() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const videoRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => togglePlay();

  const handleMouseEnter = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
  };

  const toggleBookmark = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid || !VIDEO_ID) return;

    const { data: existing } = await supabase
      .from("favoris_videos")
      .select("*")
      .eq("user_id", uid)
      .eq("video_id", VIDEO_ID)
      .single();

    if (existing) {
      await supabase
        .from("favoris_videos")
        .delete()
        .eq("user_id", uid)
        .eq("video_id", VIDEO_ID);
      setIsBookmarked(false);
    } else {
      await supabase.from("favoris_videos").insert([
        {
          user_id: uid,
          video_id: VIDEO_ID,
          title: "Le plaisir sans tabou",
          description: "Cette vidéo aborde le plaisir avec simplicité et bienveillance...",
          image_url: "/images/ecoute2.png",
        },
      ]);
      setIsBookmarked(true);
    }
  };

  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", VIDEO_ID)
        .eq("content_type", "video");
    } else {
      await supabase.from("likes").insert([
        { user_id: userId, content_id: VIDEO_ID, content_type: "video" }
      ]);
    }

    setLiked(!liked);
    fetchLikeCount(); // refresh compteur
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("content_id", VIDEO_ID)
      .eq("content_type", "video");

    setLikeCount(count || 0);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      setUserId(uid);

      if (!uid || !VIDEO_ID) return;

      const { data: bookmark } = await supabase
        .from("favoris_videos")
        .select("*")
        .eq("user_id", uid)
        .eq("video_id", VIDEO_ID)
        .single();
      setIsBookmarked(!!bookmark);

      const { data: like } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", uid)
        .eq("content_id", VIDEO_ID)
        .eq("content_type", "video");
      setLiked(like.length > 0);

      fetchLikeCount();
    };

    init();
  }, []);

  return (
    <main className="min-h-screen bg-white pb-20 w-full">
      {/* Vidéo */}
      <div
        className="relative w-full h-[200px] md:h-[400px] lg:h-[500px] rounded-bl-xl rounded-br-xl overflow-hidden bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster="/images/ecoute2.png"
          className="w-full h-[200px] md:h-[400px] lg:h-[500px] object-cover cursor-pointer"
          onClick={handleVideoClick}
          onPlay={handlePlay}
          onPause={handlePause}
          preload="metadata"
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => router.push("/recherche")}
              className="p-2 bg-white rounded-full shadow-xl hover:bg-white/30 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {/* Like button */}
              <button
                onClick={toggleLike}
                className="p-3 bg-white rounded-full shadow-xl hover:bg-white/30 transition-all duration-200"
              >
                <Heart fill={liked ? "red" : "none"} color="red" />
              </button>

              {/* Bookmark button */}
              <button
                onClick={toggleBookmark}
                className="p-3 bg-white rounded-full shadow-xl hover:bg-white/30 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-pink-200/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-pink-200/90 transition-all duration-300 hover:scale-110"
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
        <h1 className="text-2xl md:text-4xl font-semibold text-black">Le plaisir sans tabou</h1>
        <p className="mt-2 text-gray-700 text-sm md:text-lg leading-relaxed">
          Cette vidéo aborde le plaisir avec simplicité et bienveillance... (texte résumé)
        </p>
        <p className="mt-2 text-gray-500 text-sm">{likeCount} ❤️</p>
      </section>

      {/* Quiz */}
      <Link href="/quiz" className="mt-6 block px-4 md:px-4">
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

      {/* Barre de navigation */}
      <NavShare query={query} setQuery={setQuery} />
    </main>
  );
}
