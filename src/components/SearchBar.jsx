'use client'

import React from 'react'

export default function SearchBar({ query, setQuery }) {
  return (
    <div className="flex items-center bg-[#EDEAEA] rounded-[12px] px-4 py-4 mb-6">
      {/* Icône de recherche */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        className="flex-shrink-0"
      >
        <path
          d="M12.25 21C17.4967 21 21.75 16.7467 21.75 11.5C21.75 6.25329 17.4967 2 12.25 2C7.00329 2 2.75 6.25329 2.75 11.5C2.75 16.7467 7.00329 21 12.25 21Z"
          stroke="#9C9C9C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.75 22L20.75 20"
          stroke="#9C9C9C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <input
        type="text"
        placeholder="Recherche"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder-[#9C9C9C]"
      />
    </div>
  )
}