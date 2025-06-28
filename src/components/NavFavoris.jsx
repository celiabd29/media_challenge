"use client";

import React from "react";

const tabs = [
  { key: "Tout" },
  { key: "Article" },
  { key: "Vidéo" },
  { key: "Podcast" },
];

export default function NavigationFavoris({ selectedTab, setSelectedTab }) {
  return (
    <nav className="flex mb-8 gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === selectedTab;
        const base =
          "flex flex-col items-center justify-center px-3 py-4 rounded-lg text-sm font-medium border-2 flex-1 min-w-0 transition";
        const activeClasses = "bg-blue-500 border-blue-500 text-white";
        const inactiveClasses =
          "bg-white border-blue-500 text-blue-500 hover:border-blue-600";

        const icons = {
          Tout: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12.25" cy="11.5" r="7" />
              <path d="M22.75 22L20.75 20" />
            </svg>
          ),
          Article: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          ),
          Vidéo: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="15" height="12" rx="2" ry="2" />
              <polygon points="10 8 16 12 10 16" />
            </svg>
          ),
          Podcast: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ),
        };

        return (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`${base} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {React.cloneElement(icons[tab.key], {
              width: 20,
              height: 20,
              stroke: isActive ? "#ffffff" : "#3b82f6",
            })}
            <span className="capitalize text-xs pt-1">{tab.key}</span>
          </button>
        );
      })}
    </nav>
  );
}
