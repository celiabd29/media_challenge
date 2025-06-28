'use client'

import React from 'react'
// import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BottomNavbar from '../../components/BottomNavbar'


export default function ComptePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="p-2">
          {/* <ArrowLeft size={24} className="text-gray-800" /> */}
        </button>
        <button onClick={() => {/* share logic */}} className="p-2">
          {/* <Share2 size={24} className="text-gray-800" /> */}
        </button>
      </header>

      {/* Avatar + Nom / Email */}
      <div className="flex flex-col items-center mt-4 px-4">
        <div className="relative">
          <button
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md"
            onClick={() => {/* edit avatar */}}
          >
            {/* <User size={16} className="text-gray-800" /> */}
          </button>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          (nom)
        </h2>
        <p className="text-gray-500">(mail)</p>
      </div>

      {/* Menu */}
      <nav className="mt-8 space-y-4 px-4 flex-1">
        <Link
          href="/compte/mon"
          className="flex items-center justify-between bg-green-100 p-4 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            {/* <User size={20} className="text-green-700" /> */}
            <span className="font-medium text-green-800">Mon Compte</span>
          </div>
          {/* <ArrowRight size={20} className="text-green-700" /> */}
        </Link>

        <Link
          href="/compte/parametres"
          className="flex items-center justify-between bg-purple-100 p-4 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            {/* <Settings size={20} className="text-purple-700" /> */}
            <span className="font-medium text-purple-800">Paramètres</span>
          </div>
          {/* <ArrowRight size={20} className="text-purple-700" /> */}
        </Link>

        <Link
          href="/compte/premium"
          className="flex items-center justify-between bg-blue-100 p-4 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            {/* <Diamond size={20} className="text-blue-700" /> */}
            <span className="font-medium text-blue-800">Premium</span>
          </div>
          {/* <ArrowRight size={20} className="text-blue-700" /> */}
        </Link>
        {/* Ajoute autant de <Link> que nécessaire */}
      </nav>
      <BottomNavbar />
    </div>
  )
}