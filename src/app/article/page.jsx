'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedType, setSelectedType] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const category = 'Écoute'; // ou params.get('category') si tu passes par l'URL

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement articles :', error);
      } else {
        setArticles(data);
        setFilteredArticles(data);
      }
    };

    fetchArticles();
  }, [category]);

  useEffect(() => {
    let result = [...articles];

    if (selectedType !== 'Tout') {
      result = result.filter((a) => a.type === selectedType.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(result);
  }, [searchQuery, selectedType, articles]);

  const typeTabs = ['Tout', 'Article', 'Vidéo', 'Podcast'];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500">
          ← Retour
        </button>
        <h1 className="text-xl font-bold">Écoute</h1>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Recherche"
        className="w-full mb-4 px-4 py-2 rounded-xl bg-gray-100 text-gray-800 placeholder:text-gray-400 focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Type filters */}
      <div className="flex gap-2 mb-6">
        {typeTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedType(tab)}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedType === tab
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Popular horizontal */}
      <h2 className="text-lg font-semibold mb-2">Les plus populaires</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} horizontal />
        ))}
      </div>

      {/* Popular vertical */}
      <h2 className="text-lg font-semibold mt-6 mb-4">Les plus populaires</h2>
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ article, horizontal = false }) {
  const router = useRouter();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: window.location.origin + `/article/${article.id}`,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + `/article/${article.id}`);
        alert('Lien copié !');
      }
    } catch (e) {
      console.error('Erreur partage :', e);
    }
  };

  return (
    <div
      className={`${
        horizontal ? 'min-w-[250px] max-w-xs' : 'w-full'
      } bg-white rounded-xl shadow p-3 flex ${horizontal ? 'flex-col' : 'gap-4'} items-start`}
    >
      <Image
        src={article.main_image_url || '/placeholder.png'}
        alt={article.title}
        width={horizontal ? 250 : 100}
        height={horizontal ? 160 : 100}
        className={`rounded-xl object-cover ${horizontal ? 'h-40 w-full' : 'h-24 w-24'}`}
      />
      <div className="flex-1 flex flex-col gap-1 text-sm">
        <span className="text-[10px] px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full w-fit text-xs">
          {article.category}
        </span>
        <h3 className="font-semibold text-sm">{article.title}</h3>
        <p className="text-gray-500 line-clamp-2">{article.description || article.content?.slice(0, 80)}</p>
        <div className="flex items-center gap-2 text-gray-400 text-xs pt-1">
          <span>5min</span>•<span>Article</span>•<span>300</span>
        </div>
      </div>

      <div className="ml-auto mt-2 flex items-center gap-2">
        <Heart className="w-4 h-4 text-gray-400" />
        <button onClick={handleShare}>
          <Share className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
