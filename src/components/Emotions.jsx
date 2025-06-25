'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navigation from './Navigation'
import SearchBar from '../components/SearchBar'
import BottomNavbar from './BottomNavbar'

export default function Recherche() {
  const router = useRouter()         
  const [selectedTab, setSelectedTab] = useState('Tout')
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En‐tête */}
      <header className="flex items-center mb-4">
        {/* Bouton « back » circulaire */}
        <button
          onClick={() => router.push('/recherche')}
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

        {/* Titre collé */}
        <h1 className="ml-2 text-2xl font-medium">Émotions</h1>
      </header>

      <SearchBar query={query} setQuery={setQuery} />

      {/*filtre */}
      <Navigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
          <BottomNavbar />
    </div>
  )
}