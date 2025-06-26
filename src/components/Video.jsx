'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
// Pas besoin d'import lucide-react - on utilise des SVG standards
import NavShare from './NavShare'

import ecouteImg from '../assets/img/ecoute2.png'

// SOLUTION 1: Placer la vidéo dans le dossier public
const VIDEO_SRC = '/video/fleur.mp4' // Chemin depuis le dossier public

export default function Video() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef(null)
  const hideControlsTimeoutRef = useRef(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  const handleMouseEnter = () => {
    setShowControls(true)
    // Annuler le timeout de masquage si on survole
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    // Masquer les contrôles seulement si la vidéo est en cours de lecture
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 1000) // Délai de 1 seconde après avoir quitté la zone
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    // Masquer les contrôles après 2 secondes quand la vidéo démarre
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  const handlePause = () => {
    setIsPlaying(false)
    setShowControls(true)
    // Annuler le timeout de masquage quand on met en pause
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
  }

  const toggleBookmark = () => {
    // Logique de favoris - tu peux ajouter ta logique ici
    console.log('Favoris toggled')
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HEADER */}
      <header className="flex items-center justify-between">
    
      </header>

      {/* LECTEUR VIDÉO AVEC CONTRÔLES PERSONNALISÉS */}
      <div 
        className="relative w-full h-[320px] rounded-bl-xl rounded-br-xl overflow-hidden bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Vidéo */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster="/images/ecoute2.png" // Aussi dans public/images/
          className="w-full h-[320px] object-cover cursor-pointer"
          onClick={handleVideoClick}
          onPlay={handlePlay}
          onPause={handlePause}
          preload="metadata"
        >
          {/* Message de fallback si la vidéo ne se charge pas */}
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

        {/* Overlay avec contrôles */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Gradient overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
          
          {/* Contrôles du haut - Flèche retour et favoris superposés */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Bouton retour superposé */}
            <button
              onClick={() => router.push('/recherche')}
              className="p-2 bg-white rounded-full shadow-xl shadow-lg hover:bg-white/30 transition-all duration-200"
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
            
            {/* Bouton favoris superposé */}
            <button
              onClick={toggleBookmark}
              className="p-3 bg-white rounded-full shadow-xl hover:bg-white/30 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Bouton play/pause central */}
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

      {/* TITRE & DESCRIPTION */}
      <section className="mt-6 px-4">
        <h1 className="text-2xl font-semibold text-black">
          Le plaisir sans tabou
        </h1>
        <p className="mt-2 text-gray-700 text-sm leading-relaxed">
          Cette vidéo aborde le plaisir avec simplicité et bienveillance, en levant les tabous qui l'entourent souvent. Elle invite à comprendre les sensations, à parler librement de ses envies, et à découvrir que le plaisir fait naturellement partie de la vie. Un guide pour démystifier et valoriser cette expérience intime, dans le respect de soi et des autres.
        </p>
      </section>

      {/* CTA QUIZ */}
      <Link href="/quiz" className="mt-6 block px-4">
        <div className="flex items-center bg-[#E9C4DE] h-[89px] rounded-[8px] px-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="">
            <Image
              src={ecouteImg}
              alt="Illustration quiz"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          
          <span className="ml-4 flex-1 text-white font-medium">
            Effectuez le quiz
          </span>
          
          <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
      <NavShare query={query} setQuery={setQuery} />
      
    </main>
  )
}