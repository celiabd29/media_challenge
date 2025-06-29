'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share } from 'lucide-react';
import SearchBar from "../components/SearchBar";
import { useAuth } from '@/contexts/AuthContext';

export default function EcoutePage() {
  const [favoris, setFavoris] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Tout');
  const [query, setQuery] = useState("");
  const { user } = useAuth(); 
  const router = useRouter();

  const tabs = [
    { key: 'Tout', label: 'Tout' },
    { key: 'Article', label: 'Article' },
    { key: 'Video', label: 'Vidéo' },
    { key: 'Podcast', label: 'Podcast' },
  ];

  useEffect(() => {
    const fetchFavoris = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('favoris')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Erreur chargement favoris :", error.message);
        return;
      }

      const loaded = await Promise.all(
        data.map(async (fav) => {
          let table = '';
          if (fav.type === 'article') table = 'articles';
          else if (fav.type === 'video') table = 'videos';
          else if (fav.type === 'podcast') table = 'podcasts';

          const { data: content } = await supabase
            .from(table)
            .select('*')
            .eq('id', fav.content_id)
            .single();

          if (!content) return null;

          return {
            ...content,
            type: fav.type.charAt(0).toUpperCase() + fav.type.slice(1), // Article / Vidéo / Podcast
            path: `/${fav.type}/${content.id}`,
          };
        })
      );

      const valid = loaded.filter((c) => c !== null);
      setFavoris(valid);
      setFiltered(valid);
    };

    fetchFavoris();
  }, [user]);

  useEffect(() => {
    if (selectedTab === 'Tout') {
      setFiltered(favoris);
    } else {
      setFiltered(favoris.filter((item) => item.type === selectedTab));
    }
  }, [selectedTab, favoris]);

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push("/recherche")}
          className="p-2 bg-white rounded-full shadow-xl"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-2 text-2xl font-medium">Mes Favoris</h1>
      </div>

      <SearchBar query={query} setQuery={setQuery} />

      <nav className="flex mb-8 gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === selectedTab;
          return (
            <button
              key={tab.key}
              className={`flex-1 px-3 py-2 text-sm rounded-full border-2 ${
                isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-500'
              }`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {filtered.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-row sm:flex-col"
          >
            <Image
              src={item.image_url || item.main_image_url || '/placeholder.png'}
              alt={item.title}
              width={130}
              height={130}
              className="w-[130px] h-[130px] object-cover sm:w-full sm:h-40"
            />
            <div className="p-4 flex flex-col justify-between gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full w-fit text-xs">
                  {item.category || 'Favoris'}
                </span>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description || item.content?.slice(0, 100)}...
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
                <span>5 min</span>
                <span>{item.type}</span>
                <div className="flex gap-2 text-gray-400">
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
