// "use client";

// import { Suspense } from "react";
// import ArticlePage from "@/components/ArticlePage";
// import NavBar from "@/components/BottomNavbar";

// export default function ArticleWrapper() {
//   return (
//     <Suspense fallback={<p>Chargement de l'article...</p>}>
//       <ArticlePage />
//       <NavBar />
//     </Suspense>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import NavBar from "@/components/BottomNavbar";
import Image from 'next/image';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null);
      } else {
        setUserId(user.id);
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur récupération article :', error);
        return;
      }
      setArticle(data);

      // Check if already favorited
      if (user) {
        const { data: favoris } = await supabase
          .from('favoris_articles')
          .select('*')
          .eq('user_id', user.id)
          .eq('article_id', id);
        setIsFavorited(favoris?.length > 0);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleFavoris = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    if (isFavorited) {
      await supabase
        .from('favoris_articles')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', id);
      setIsFavorited(false);
      alert('Retiré des favoris');
    } else {
      await supabase.from('favoris_articles').insert({
        user_id: userId,
        article_id: id,
      });
      setIsFavorited(true);
      alert('Ajouté aux favoris');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers');
      }
    } catch (err) {
      toast.error('Erreur lors du partage');
    }
  };

  const renderParagraphs = (text) =>
    text.split('\n\n').map((para, i) => (
      <p key={i} className="mb-4 text-base leading-relaxed">
        {para}
      </p>
    ));

  if (!article) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-300">
        Chargement de l’article...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto text-gray-900 dark:text-white">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()} className="text-gray-600 dark:text-gray-300">
          <ArrowLeft />
        </button>
        <div className="flex gap-3">
          <button onClick={handleShare} aria-label="Partager">
            <Share className="text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={handleToggleFavoris} aria-label="Favori">
            <Heart
              className={`w-6 h-6 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main image */}
      {article.main_image_url && (
        <Image
          src={article.main_image_url}
          alt={article.title}
          width={800}
          height={400}
          className="rounded-xl w-full object-cover mb-4"
        />
      )}

      {/* Catégorie */}
      {article.category && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2 dark:bg-blue-800 dark:text-blue-100">
          {article.category}
        </span>
      )}

      {/* Titre */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>

      {/* Contenu 1ère partie */}
      <div className="text-justify">{renderParagraphs(article.content.split('\n\n').slice(0, 3).join('\n\n'))}</div>

      {/* Secondary image */}
      {article.secondary_image_url && (
        <Image
          src={article.secondary_image_url}
          alt="Illustration secondaire"
          width={800}
          height={400}
          className="rounded-xl w-full object-cover my-6"
        />
      )}

      {/* Contenu 2e partie */}
      <div className="text-justify">{renderParagraphs(article.content.split('\n\n').slice(3).join('\n\n'))}</div>

      {/* Quiz CTA */}
      <div className="bg-pink-100 dark:bg-pink-900 mt-10 p-6 rounded-xl flex flex-col md:flex-row items-center gap-4">
        <div className="flex-shrink-0 text-4xl">🎯</div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1">Testez vos connaissances</h3>
          <p className="text-sm mb-2">Évaluez votre compréhension avec notre quiz interactif</p>
          <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded">
            Effectuez le quiz
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
