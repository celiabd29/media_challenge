
'use client';

import Image from "next/image";
import BottomNavbar from "../components/BottomNavbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

import ecouteImg       from '../assets/img/ecoute2.png';
import emotionImg      from '../assets/img/emotion2.png';
import consentementImg from '../assets/img/consentement2.png';
import puberteImg      from '../assets/img/puberte2.png';
import identiteImg     from '../assets/img/identite.png';
import proImg          from '../assets/img/parler_pro.png';

const categories = [
  { key: 'ecoute',       label: 'Écoute',       image: ecouteImg,       bgColor: 'bg-[#E9C4DE]', href: '/ecoute' },
  { key: 'emotions',     label: 'Émotions',     image: emotionImg,      bgColor: 'bg-[#E0EED0]', href: '/emotions' },
  { key: 'consentement', label: 'Consentement', image: consentementImg, bgColor: 'bg-[#FFCFA6]', href: '/consentement' },
  { key: 'puberte',      label: 'Puberté',      image: puberteImg,      bgColor: 'bg-[#B3D1ED]', href: '/puberte' },
  { key: 'identite',     label: 'Identité',     image: identiteImg,     bgColor: 'bg-[#DDC8FF]', href: '/identite' },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from("users")
        .select("nom")
        .eq("id", userId)
        .maybeSingle();
      if (data && data.nom) setUserName(data.nom);
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleShare = (article) => {
    if (!navigator.share) {
      alert("Le partage n'est pas supporté sur ce navigateur.");
      return;
    }
    navigator.share({
      title: article.title,
      text: 'Découvrez ce contenu !',
      url: window.location.href + `/article/${article.id}`,
    }).catch((error) => console.error('Erreur de partage :', error));
  };

  return (
    <main className="min-h-screen bg-white px-2 md:px-8 lg:px-16 pb-20 w-full">
      <header className="pt-8 flex items-center justify-between">
        <p className="text-lg md:text-2xl text-gray-700">
          Bonjour 👋 <br /> <span className="font-semibold">{userName || " "}</span>
        </p>
      </header>

      <section className="mt-6">
        <h1 className="text-xl md:text-3xl font-semibold mb-4">Notre dernier reportage</h1>
        <div className="w-full flex justify-start">
          <div className="w-[400px] md:w-[800px] lg:w-[480px] h-[200px] md:h-[230px] lg:h-[270px] rounded-2xl overflow-hidden shadow-lg relative">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/7cFH6wYsy54?si=tO45Y0YD_rksYith"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <span className="absolute top-3 left-3 bg-[#EAB1D9] text-white text-xs font-medium px-3 py-1 rounded-full z-10">
              Nouveauté
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-12 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Catégories</h2>
          <Link href="/recherche" className="text-blue-600 text-sm font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="flex gap-x-3 md:gap-x-6 overflow-x-scroll hide-scrollbar">
          {categories.map(cat => (
            <Link key={cat.key} href={cat.href} className="flex-shrink-0 flex flex-col items-center">
              <div className={`${cat.bgColor} w-[90px] h-[88px] md:w-[140px] md:h-[130px] rounded-lg flex items-center justify-center shadow-sm mb-2`}>
                <Image src={cat.image} width={140} height={130} alt={cat.label} />
              </div>
              <p className="text-sm md:text-lg text-gray-700 mb-4 text-center">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 md:mt-8 mb-8 w-full">
        <div className="relative h-[180px] md:h-[240px] bg-[#4069E1] rounded-[20px] pl-6 pr-8 md:p-10 flex items-center overflow-hidden">
          <div className="flex-1 text-white z-10 pr-8 md:pr-20">
            <h3 className="text-sm md:text-xl font-semibold leading-tight mb-3">
              Besoin de parler à un<br />professionnel ?
            </h3>
            <p className="text-sm md:text-lg md:pr-14 pb-2 opacity-90">
              Rejoignez un live en groupe pour discuter avec un professionnel bienveillant, à votre rythme.
            </p>
            <Link
              href="/visio"
              className="inline-block bg-white text-[#4069E1] text-sm md:text-base font-medium px-6 py-2.5 rounded-[8px] hover:bg-gray-100 transition"
            >
              Voir les visioconférences
            </Link>
          </div>
          <div className="absolute right-0 top-0 h-full flex items-center">
            <Image 
              src={proImg} 
              alt="Consultation pro" 
              width={180} 
              height={200}
              className="object-cover h-full" 
            />
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-12 mb-8 w-full">
        <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">Les plus populaires</h2>
        <div className="flex flex-col gap-4 md:gap-8">
          {articles.length > 0 ? (
            articles.slice(0, 5).map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="flex bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition md:text-lg md:p-6"
              >
                <div className="relative pl-3 pt-2 flex-shrink-0 w-[100px] h-[130px] md:w-[180px] md:h-[220px] md:pr-4">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="object-cover rounded-[8px] w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-4 bg-yellow-100 text-gray-800 text-[10px] md:text-xs font-medium px-2 py-0.5 md:mt-4 md:ml-3 rounded">
                    {article.category}
                  </span>
                </div>

                <div className="flex-1 p-2 pb-4 flex flex-col justify-between relative">
                  <div className="absolute top-3 right-1 flex flex-col gap-2">
                    <button className="bg-gray-50 rounded-full p-2 w-9 h-9 flex items-center justify-center hover:bg-gray-100 shadow-md">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleShare(article);
                      }}
                      className="bg-gray-50 rounded-full p-2 w-9 h-9 flex items-center justify-center hover:bg-gray-100 shadow-md"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </button>
                  </div>

                  <div className="pr-6">
                    <h3 className="text-[15px] md:text-xl font-bold text-black mb-2 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-base leading-relaxed line-clamp-3 mb-3">
                      {article.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] md:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      5min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      Article
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {article.article_like_counts?.like_count ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun article pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNavbar />
      </div>
    </main>
  );
}
