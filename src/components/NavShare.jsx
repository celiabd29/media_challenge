'use client';

import { Heart, Share, BookmarkPlus } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export default function ActionBar({ contentId, type }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLike = async () => {
      if (!user || !contentId) return;

      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', type);

      setLiked(data?.length > 0);

      const { data: countData } = await supabase
        .from(`${type}_like_counts`) // ex: article_like_counts
        .select('like_count')
        .eq('content_id', contentId)
        .single();

      setLikeCount(countData?.like_count || 0);
    };

    fetchLike();
  }, [user, contentId, type]);

  const handleToggleLike = async () => {
    if (!user) return;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', type);
    } else {
      await supabase
        .from('likes')
        .insert([{ user_id: user.id, content_id: contentId, content_type: type }]);
    }

    setLiked(!liked);
    const { data } = await supabase
      .from(`${type}_like_counts`)
      .select('like_count')
      .eq('content_id', contentId)
      .maybeSingle();
    setLikeCount(data?.like_count || 0);
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    alert("Lien copié !");
  };

  return (
    <div className="mt-6 mb-4 bg-blue-500 text-white rounded-t-2xl px-8 py-4 flex items-center justify-around">
      <BookmarkButton contentId={contentId} type={type} />

      <button
        onClick={handleToggleLike}
        className="p-2 rounded-full hover:bg-blue-400 transition"
        aria-label="Like"
      >
        <Heart className={`w-5 h-5 ${liked ? 'fill-white' : 'fill-none'}`} />
      </button>

      <button
        onClick={handleShare}
        className="p-2 rounded-full hover:bg-blue-400 transition"
        aria-label="Partager"
      >
        <Share className="w-5 h-5" />
      </button>
    </div>
  );
}
