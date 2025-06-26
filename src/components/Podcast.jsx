'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import NavShare from './NavShare'

import quizImg from '../assets/img/emotion2.png'

const AUDIO_SRC = '/audio/sebi-la-gazelle_mixage.wav'

export default function AudioPlayer() {
  const router = useRouter()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Mettre à jour le temps et la durée
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const seek = (offset) => {
    if (!audioRef.current) return
    let t = audioRef.current.currentTime + offset
    t = Math.max(0, Math.min(t, duration))
    audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const fmt = (t = 0) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- Panneau AUDIO haut */}
      <section className="relative bg-[#BFDB9F] rounded-b-xl pt-6 pb-8 px-4">
        {/* Back / Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-full shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => console.log('bookmark')}
            className="p-2 bg-white rounded-full shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
            </svg>
          </button>
        </div>

        {/* Titre + catégorie */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Entre envies et peurs</h1>
          <p className="text-sm text-[#4069E1]">Émotions</p>
        </div>

        {/* Contrôles (-10 / play / +10) */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <button onClick={() => seek(-10)} className="p-2 bg-white rounded-full shadow">
            <span className="text-green-700 text-sm font-medium">-10s</span>
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-white rounded-full mx-8 flex items-center justify-center shadow-lg"
          >
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

        {/* Barre de progression */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-xs text-black">{fmt(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const t = parseFloat(e.target.value)
              if (audioRef.current) {
                audioRef.current.currentTime = t
              }
              setCurrentTime(t)
            }}
            className="flex-1 h-3 rounded-full mx-3"
            style={{ accentColor: "#2563eb" }}
          />
          <span className="text-xs text-black">{fmt(duration)}</span>
        </div>

        {/* Élément audio (invisible) */}
        <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
      </section>

      {/* --- Description + Quiz CTA */}
      <section className="mt-6 px-4">
        <h2 className="text-2xl font-semibold text-black">Entre envies et peurs</h2>
        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
          Entre envies et peurs est un podcast qui explore avec bienveillance les questions complexes autour de la sexualité. Que ce soit les désirs naissants, les doutes, les peurs ou les tabous, chaque épisode invite à écouter des témoignages, à comprendre les émotions et à déconstruire les idées reçues.
          Destiné aussi bien aux jeunes qu'aux parents ou éducateurs, ce podcast offre un espace sûr pour parler librement de ce qui peut parfois sembler difficile ou embarrassant. Ici, la parole est ouverte, sans jugement, pour mieux accompagner chacun dans son cheminement intime.
        </p>
      </section>

      <Link href="/quiz" className="mt-6 px-4 block">
        <div className="flex items-center bg-[#BFDB9F] h-[89px] rounded-xl px-2 shadow-sm">
          <Image
            src={quizImg}
            alt="Illu quiz"
            width={80}
            height={80}
            className="flex-shrink-0"
          />
          <span className="ml-4 text-white font-medium">
            Effectuez le quiz
          </span>
          <span className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>

      {/* --- NavShare en bas */}
      <NavShare />

      {/* --- Styles cross‐browser optionnels */}
      <style jsx global>{`
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
          height: 0.75rem;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 100%;
          background: #e2e8f0;
          border-radius: 0.375rem;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 1rem;
          height: 1rem;
          background: #2563eb;
          border-radius: 50%;
          margin-top: -0.125rem;
        }
        input[type="range"]::-moz-range-track {
          background: #e2e8f0;
          height: 0.75rem;
          border-radius: 0.375rem;
        }
        input[type="range"]::-moz-range-progress {
          background: #2563eb;
          height: 0.75rem;
          border-radius: 0.375rem;
        }
      `}</style>
    </main>
  )
}
