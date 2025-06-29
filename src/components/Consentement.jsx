'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share } from 'lucide-react';
import SearchBar from "../components/SearchBar";
import { useDarkMode } from "../contexts/DarkModeContext";
import React from 'react';

export default function ConsentementPage() {
  const [contents, setContents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Tout');
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const tabs = [
    {
      key: 'Tout',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12.25" cy="11.5" r="7" />
          <path d="M22.75 22L20.75 20" />
        </svg>
      ),
    },
    {
      key: 'Article',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      key: 'Vidéo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="15" height="12" rx="2" ry="2" />
          <polygon points="10 8 16 12 10 16" />
        </svg>
      ),
    },
    {
      key: 'Podcast',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      const [a, v, p] = await Promise.all([
        supabase.from("articles").select("*").eq("category_id", 3),
        supabase.from("videos").select("*").eq("category_id", 3),
        supabase.from("podcasts").select("*").eq("category_id", 3),
      ]);
    
      const articles = (a.data || []).map((item) => ({
        ...item,
        type: "Article",
        path: `/article/${item.id}`,
      }));
    
      const videos = (v.data || []).map((item) => ({
        ...item,
        type: "Vidéo",
        path: `/video/${item.id}`,
      }));
    
      const podcasts = (p.data || []).map((item) => ({
        ...item,
        type: "Podcast",
        path: `/podcast/${item.id}`,
      }));
    
      const all = [...articles, ...videos, ...podcasts];
      setContents(all);
      setFiltered(all);
    };
    

    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedTab === 'Tout') {
      setFiltered(contents);
    } else {
      setFiltered(contents.filter((item) => item.type === selectedTab));
    }
  }, [selectedTab, contents]);

  return (
    <div className={`flex flex-col min-h-screen pb-20 px-4 py-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push("/recherche")}
          className={`p-2 rounded-full shadow-xl ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={`ml-2 text-2xl font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Consentement</h1>
      </div>
  
      <SearchBar query={query} setQuery={setQuery} />
  
      <nav className="flex mb-8 gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === selectedTab;
          const base = "flex flex-col items-center justify-center px-3 py-4 rounded-lg text-sm font-medium border-2 flex-1 min-w-0 transition";
          const activeClasses = "bg-blue-500 border-blue-500 text-white";
          const inactiveClasses = darkMode
            ? "bg-gray-800 border-blue-500 text-blue-400 hover:border-blue-400"
            : "bg-white border-blue-500 text-blue-500 hover:border-blue-600";
  
          return (
            <button
              key={tab.key}
              className={`${base} ${isActive ? activeClasses : inactiveClasses}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {React.cloneElement(tab.icon, {
                width: 20,
                height: 20,
                stroke: isActive ? "#ffffff" : "#3b82f6",
              })}
              <span className="capitalize text-xs pt-1">{tab.key}</span>
            </button>
          );
        })}
      </nav>
  
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {filtered.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-row sm:flex-col ${
              darkMode ? "bg-gray-800 border border-gray-700 text-white" : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            <Image
              src={item.image_url || item.main_image_url || "/placeholder.png"}
              alt={item.title}
              width={130}
              height={130}
              className="w-[130px] h-[130px] object-cover sm:w-full sm:h-40"
            />
            <div className="p-4 flex flex-col justify-between gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full w-fit text-xs">
                  {item.category || "Consentement"}
                </span>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} line-clamp-2`}>
                  {item.description || item.content?.slice(0, 100)}...
                </p>
              </div>
              <div className={`flex justify-between items-center text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} pt-1`}>
                <span>5 min</span>
                <span>{item.type}</span>
                <span>300</span>
                <div className="flex gap-2">
                  <Heart className="w-4 h-4" />
                  <Share className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
          }
