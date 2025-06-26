'use client'

import React from 'react'
import Link from 'next/link'

export default function FilterTabs({ active, onChange }) {
  const tabs = [
    { label: "Tout",   value: "all",     href: "/" },
    { label: "Article",value: "article", href: "/articles" },
    { label: "Vidéo",  value: "video",   href: "/video" },
    { label: "Podcast",value: "podcast", href: "/podcasts" },
  ];

  return (
    <div className="flex gap-2 my-4">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const baseClasses = "flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all";
        const activeClasses = "bg-blue-600 text-white";
        const inactiveClasses = "bg-white text-blue-600 border-blue-200";

        return (
          <Link key={tab.value} href={tab.href} passHref>
            <a
              onClick={() => onChange(tab.value)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              {tab.label}
            </a>
          </Link>
        )
      })}
    </div>
  )
}