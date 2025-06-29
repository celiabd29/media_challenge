'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ contentId, type }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriId, setFavoriId] = useState(null);

  useEffect(() => {
    const checkFavori = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('favoris')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('type', type)
        .single();

      if (data) {
        setIsFavorited(true);
        setFavoriId(data.id);
      }
    };

    checkFavori();
  }, [user, contentId, type]);

  const toggleFavori = async () => {
    if (!user) return;

    if (isFavorited) {
      const { error } = await supabase
        .from('favoris')
        .delete()
        .eq('id', favoriId);

      if (!error) {
        setIsFavorited(false);
        setFavoriId(null);
      }
    } else {
      const { data, error } = await supabase
        .from('favoris')
        .insert({
          user_id: user.id,
          content_id: contentId,
          type,
        })
        .select()
        .single();

      if (!error) {
        setIsFavorited(true);
        setFavoriId(data.id);
      }
    }
  };

  return (
    <button
      onClick={toggleFavori}
      className={`
        p-2 rounded-full transition text-white
        hover:bg-blue-400
      `}
      aria-label="Ajouter aux favoris"
    >
      <Bookmark className={`w-6 h-6 ${isFavorited ? 'fill-white' : 'fill-none'}`} />
    </button>
  );
}
