'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import BottomNav from '../components/BottomNav'

// Imports d’images
import ecouteImg       from '../assets/img/ecoute.png'
import emotionsImg     from '../assets/img/emotions.png'
import consentementImg from '../assets/img/consentement.png'
import puberteImg      from '../assets/img/puberte.png'
import identiteImg     from '../assets/img/identite.png'
import expositionImg   from '../assets/img/exposition.png'

const categories = [
  { key: 'ecoute',       label: 'Écoute',       image: ecouteImg,       bgColor: 'bg-[#E9C4DE]' },
  { key: 'emotions',     label: 'Émotions',     image: emotionsImg,     bgColor: 'bg-[#E0EED0]' },
  { key: 'consentement', label: 'Consentement', image: consentementImg, bgColor: 'bg-[#FFCFA6]' },
  { key: 'puberte',      label: 'Puberté',      image: puberteImg,      bgColor: 'bg-[#B3D1ED]' },
  { key: 'identite',     label: 'Identité',     image: identiteImg,     bgColor: 'bg-[#E9C4DE]' },
  { key: 'exposition',   label: 'Exposition',   image: expositionImg,   bgColor: 'bg-[#FFFBC4]' },
  { key: 'test1',        label: '...',          bgColor: 'bg-[#E9C4DE]' },
  { key: 'test2',        label: '...',          bgColor: 'bg-[#E0EED0]' },
  { key: 'test3',        label: '...',          bgColor: 'bg-[#E9C4DE]' },
  { key: 'test4',        label: '...',          bgColor: 'bg-[#E0EED0]' },
]

export default function Recherche() {
  const [selectedTab, setSelectedTab] = useState('Tout')
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En‐tête */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-black font-medium text-2xl leading-6">Recherche</h1>
        <button aria-label="Favoris" className="p-2">
          {/* <Bookmark size={24} /> */}
        </button>
      </header>

      {/* Barre de recherche */}
      <div className="flex items-center bg-[#EDEAEA] rounded-[12px] px-4 py-4 mb-6">
        {/* Icône de recherche */}
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" className="flex-shrink-0">
          <path d="M12.25 21C17.4967 21 21.75 16.7467 21.75 11.5C21.75 6.25329 17.4967 2 12.25 2C7.00329 2 2.75 6.25329 2.75 11.5C2.75 16.7467 7.00329 21 12.25 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.75 22L20.75 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          placeholder="Recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder-[#9C9C9C]"
        />
      </div>

      {/* Espace principal */}
      <section className="flex-1 overflow-y-auto">
        <h2 className="text-black font-medium text-lg pb-2">Catégories</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`relative h-20 rounded-lg overflow-hidden cursor-pointer ${cat.bgColor}`}
            >
              {/* Si image absente (test), on n'affiche pas <Image> */}
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-end">
                <span className="w-full text-center text-white py-2 font-medium z-10">
                  {cat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom nav fixe */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </div>
  )
}