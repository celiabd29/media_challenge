"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Bookmark } from "lucide-react";

export default function BookmarkButton({ contentId, contentType, title, description, image_url, duration = "5min" }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userId, setUserId] = useState(null);

  const tableMap = {
    video: "favoris_videos",
    article: "favoris_articles",
    podcast: "favoris_podcasts",
  };

  const columnMap = {
    video: "video_id",
    article: "article_id",
    podcast: "podcast_id",
  };

  useEffect(() => {
    const checkBookmark = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      setUserId(uid);
      if (!uid || !contentId || !contentType) return;

      const { data } = await supabase
        .from(tableMap[contentType])
        .select("*")
        .eq("user_id", uid)
        .eq(columnMap[contentType], contentId)
        .single();

      setIsBookmarked(!!data);
    };

    checkBookmark();
  }, [contentId, contentType]);

  const toggleBookmark = async () => {
    if (!userId) return;

    const table = tableMap[contentType];
    const column = columnMap[contentType];

    if (isBookmarked) {
      await supabase
        .from(table)
        .delete()
        .eq("user_id", userId)
        .eq(column, contentId);
      setIsBookmarked(false);
    } else {
      await supabase.from(table).insert([{
        user_id: userId,
        [column]: contentId,
        title,
        description,
        image_url,
        duration,
      }]);
      setIsBookmarked(true);
    }
  };

  return (
    <button onClick={toggleBookmark} className="p-3 bg-white rounded-full shadow-xl hover:bg-white/30 transition-all duration-200">
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-blue-500 stroke-blue-500" : ""}`} />
    </button>
  );
}
