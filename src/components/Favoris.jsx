'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import Navigation from './Navigation'

export default function Recherche() {
  const [selectedTab, setSelectedTab] = useState('Tout')
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En‐tête */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-black font-medium text-2xl leading-6">Favoris</h1>
        <button aria-label="Favoris" className="p-2">
          {/* <Bookmark size={24} /> */}
        </button>
      </header>

      {/* Barre de recherche */}
      <div className="flex items-center bg-[#EDEAEA] rounded-[12px] px-4 py-4 mb-6">
        <Search size={24} className="text-[#9C9C9C]" />
        <input
          type="text"
          placeholder="Recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder-[#9C9C9C]"
        />
      </div>

      {/* Tabs de filtre */}
      <Navigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Espace principal (au besoin flex-1 pour forcer le stretch) */}
      <section className="flex-1 overflow-y-auto">
        {/* … ici tes catégories ou autres contenus … */}
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
