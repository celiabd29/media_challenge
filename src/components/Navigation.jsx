'use client'

import React from 'react'
import { Search, FileText, Video, Mic2 } from 'lucide-react'

const tabs = [
  { key: 'Tout',     icon: <Search /> },
  { key: 'Article',  icon: <FileText /> },
  { key: 'Vidéo',    icon: <Video /> },
  { key: 'Podcast',  icon: <Mic2 /> },
]

export default function Navigation({ selectedTab, setSelectedTab }) {
  return (
    <nav className="flex mb-8 gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === selectedTab
        return (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`
              flex flex-col items-center justify-center
              px-3 py-4 rounded-lg text-sm font-medium
              border-2 flex-1 min-w-0
              ${isActive
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-white border-blue-500 text-blue-500 hover:border-blue-600'}
            `}
          >
            {/* Icône colorée selon l'état actif */}
            {React.cloneElement(tab.icon, {
              size: 20,
              color: isActive ? '#ffffff' : '#3b82f6',
            })}
            <span className="capitalize text-xs pt-1">{tab.key}</span>
          </button>
        )
      })}
    </nav>
  )
}