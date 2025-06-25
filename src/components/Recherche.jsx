'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import SearchBar from '../components/SearchBar'
import { useRouter } from "next/navigation";
import BottomNavbar from './BottomNavbar';

// imp d'images
import ecouteImg       from '../assets/img/ecoute.png'
import emotionsImg     from '../assets/img/emotions.png'
import consentementImg from '../assets/img/consentement.png'
import puberteImg      from '../assets/img/puberte.png'
import identiteImg     from '../assets/img/identite.png'
import expositionImg   from '../assets/img/exposition.png'

const categories = [
    { key: 'ecoute',       label: 'Écoute',       image: ecouteImg,       bgColor: 'bg-[#E9C4DE]', href: '/ecoute' },
    { key: 'emotions',     label: 'Émotions',     image: emotionsImg,     bgColor: 'bg-[#E0EED0]', href: '/emotions' },
    { key: 'consentement', label: 'Consentement', image: consentementImg, bgColor: 'bg-[#FFCFA6]', href: '/consentement' },
    { key: 'puberte',      label: 'Puberté',      image: puberteImg,      bgColor: 'bg-[#B3D1ED]', href: '/puberte' },
    { key: 'identite',     label: 'Identité',     image: identiteImg,     bgColor: 'bg-[#E9C4DE]', href: '/identite' },
    { key: 'exposition',   label: 'Exposition',   image: expositionImg,   bgColor: 'bg-[#FFFBC4]', href: '/exposition' },
    { key: 'test1',        label: '...',          bgColor: 'bg-[#E9C4DE]', href: '/test1' },
    { key: 'test2',        label: '...',          bgColor: 'bg-[#E0EED0]', href: '/test2' },
    { key: 'test3',        label: '...',          bgColor: 'bg-[#E9C4DE]', href: '/test3' },
    { key: 'test4',        label: '...',          bgColor: 'bg-[#E0EED0]', href: '/test4' },
  ]

export default function Recherche() {
  const [selectedTab, setSelectedTab] = useState('Tout')
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleCategoryClick = (category) => {
    if (category.href) {
      router.push(category.href)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En‐tête */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-black font-medium text-2xl leading-6">Recherche</h1>
      </header>

      {/* barre recherche */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* categorie */}
      <section className="flex-1 overflow-y-auto">
        <h2 className="text-black font-medium text-lg pb-2">Catégories</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => handleCategoryClick(cat)}
              className={`relative h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${cat.bgColor}`}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                />
              )}
              {/* Filtre noir semi-transparent */}
              <div className="absolute inset-0 backdrop-invert bg-black/10  backdrop-opacity-10"></div>
              
              <div className="absolute inset-0 flex items-end">
                <span className="w-full text-center text-white py-2 font-medium z-10">
                  {cat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <BottomNavbar />
     </div>
  )
  
}
