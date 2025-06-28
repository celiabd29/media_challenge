"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";

export default function useFavoris(type, contentId) {
  const [isFavori, setIsFavori] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchFavori = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const user_id = session?.user?.id;
      setUserId(user_id);

      if (!user_id || !contentId) return;

      const { data, error } = await supabase
        .from(`favoris_${type}`)
        .select("*")
        .eq("user_id", user_id)
        .eq(`${type.slice(0, -1)}_id`, contentId)
        .single();

      setIsFavori(!!data && !error);
    };

    fetchFavori();
  }, [type, contentId]);

  const toggleFavori = async () => {
    if (!userId) return;

    if (isFavori) {
      await supabase
        .from(`favoris_${type}`)
        .delete()
        .eq("user_id", userId)
        .eq(`${type.slice(0, -1)}_id`, contentId);
      setIsFavori(false);
    } else {
      await supabase.from(`favoris_${type}`).insert({
        user_id: userId,
        [`${type.slice(0, -1)}_id`]: contentId
      });
      setIsFavori(true);
    }
  };

  return { isFavori, toggleFavori };
}
