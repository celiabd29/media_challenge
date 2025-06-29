"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share } from "lucide-react";
import ShareModal from '@/components/ShareModal';
import BookmarkButton from '@/components/BookmarkButton';
import { supabase } from '@/supabase/supabaseClient';
import quizImg from '../assets/img/emotion2.png';
import { useDarkMode } from "../contexts/DarkModeContext";


export default function Podcast({ id }) {

  const router = useRouter();
  const { darkMode } = useDarkMode();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [podcast, setPodcast] = useState(null);

  // Charger les données du podcast depuis Supabase
  useEffect(() => {
    const fetchPodcast = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Erreur podcast:", error);
      else setPodcast(data);
    };
    fetchPodcast();
  }, [id]);

  // Gérer le player audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const seek = (offset) => {
    if (!audioRef.current) return;
    let time = audioRef.current.currentTime + offset;
    time = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const fmt = (t = 0) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!podcast) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <main className={`min-h-screen pb-32 ${darkMode ? 'bg-[#0F172A] text-white' : 'bg-white text-gray-800'}`}>
      <section className="relative bg-[#BFDB9F] rounded-b-xl pt-6 pb-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <BookmarkButton contentId={podcast.id} type="podcast" />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">{podcast.title}</h1>
          <p className="text-sm text-[#4069E1]">Émotions</p>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-6">
          <button onClick={() => seek(-10)} className="p-2 bg-white rounded-full shadow">
            <span className="text-green-700 text-sm font-medium">-10s</span>
          </button>
          <button onClick={togglePlay} className="w-14 h-14 bg-white rounded-full mx-8 flex items-center justify-center shadow-lg">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#BFDB9F]" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#BFDB9F] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button onClick={() => seek(10)} className="p-2 bg-white rounded-full shadow">
            <span className="text-green-700 text-sm font-medium">+10s</span>
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <span className="text-xs text-black">{fmt(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const t = parseFloat(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = t;
              }
              setCurrentTime(t);
            }}
            className="flex-1 h-3 rounded-full mx-3"
            style={{ accentColor: darkMode ? "#93C5FD" : "#2563eb" }}
          />
          <span className="text-xs text-black">{fmt(duration)}</span>
        </div>

        <audio ref={audioRef} src={podcast.audio_url} preload="metadata" />
      </section>

      <section className="mt-6 px-4">
        <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{podcast.title}</h2>
        <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {podcast.description}
        </p>
      </section>

      <Link href="/quiz" className="mt-6 px-4 block">
        <div className="flex items-center bg-[#BFDB9F] h-[89px] rounded-xl px-2 shadow-sm">
          <Image src={quizImg} alt="Illu quiz" width={80} height={80} className="flex-shrink-0" />
          <span className="ml-4 text-white font-medium">Effectuez le quiz</span>
          <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>

      <div className={`fixed bottom-0 left-0 w-full rounded-t-2xl px-8 py-4 flex justify-around items-center z-50 ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
        <BookmarkButton contentId={podcast.id} type="podcast" />
        <button
          onClick={() => setLiked(!liked)}
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
    </main>
  );
}