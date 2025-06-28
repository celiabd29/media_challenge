import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Heart } from "lucide-react";

export default function LikeButton({ contentId, contentType, userId }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLike = async () => {
      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", userId)
        .eq("content_id", contentId)
        .eq("content_type", contentType);

      setLiked(data.length > 0);
    };

    checkLike();
  }, [userId, contentId, contentType]);

  const handleLike = async () => {
    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", contentId)
        .eq("content_type", contentType);
    } else {
      await supabase.from("likes").insert([{ user_id: userId, content_id: contentId, content_type: contentType }]);
    }
    setLiked(!liked);
  };

  return (
    <button onClick={handleLike}>
      <Heart fill={liked ? "red" : "none"} color="red" />
    </button>
  );
}
