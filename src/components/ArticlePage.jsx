'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import ecouteImg from "../assets/img/ecoute2.png";

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? null;

  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Article
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (articleError) {
        console.error("Erreur article :", articleError);
        return;
      }
      setArticle(articleData);

      // Utilisateur
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) return;

      const uid = userData.user.id;
      setUserId(uid);

      // Vérifie like
      const { data: likeData, error: likeCheckError } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", uid)
        .eq("content_id", id)
        .eq("content_type", "article");

      if (!likeCheckError) setLiked(likeData?.length > 0);

      // Compte les likes (via la vue)
      const { data: countData, error: countError } = await supabase
        .from("article_like_counts")
        .select("like_count")
        .eq("content_id", id)
        .single();

      if (!countError) {
        setLikeCount(countData?.like_count || 0);
      }
    };

    fetchData();
  }, [id]);

  // Toggle like
  const handleToggleLike = async () => {
    if (!userId || !id) return;

    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("content_id", id)
        .eq("content_type", "article");

      if (error) return console.error("Suppression like :", error);
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ user_id: userId, content_id: id, content_type: "article" }]);

      if (error) return console.error("Ajout like :", error);
    }

    setLiked(!liked);

    // Refresh like count
    const { data: countData, error: countError } = await supabase
  .from("article_like_counts")
  .select("like_count")
  .eq("content_id", String(id)) // 🔁 important
  .maybeSingle(); // 🔁 plus sûr que single()


console.log("countData:", countData); // Ajoute ça

if (!countError) {
  setLikeCount(countData?.like_count || 0);
}

  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-white text-gray-800 px-4">
      {article.image_url && (
        <img
          src={article.image_url}
          alt="Article"
          className="rounded-b-xl mb-6 w-full object-cover max-h-[260px]"
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <button onClick={handleToggleLike}>
          <Heart fill={liked ? "red" : "none"} color="red" />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">{likeCount} ❤️</p>

      <div className="space-y-4 text-base leading-relaxed">
        {article.content?.split("\n").map((para, i) => (
          <p key={i}>
            {para.trim().startsWith("*") ? (
              <strong>{para.replace("*", "").trim()}</strong>
            ) : (
              para
            )}
          </p>
        ))}
      </div>

      <div className="mt-10 pb-18">
        <Link href="/quiz">
          <div className="flex items-center bg-[#E9C4DE] h-[89px] rounded-[8px] px-4 shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={ecouteImg}
              alt="Illustration quiz"
              width={100}
              height={100}
              className="object-cover"
            />
            <span className="ml-4 flex-1 text-white font-medium">
              Effectuez le quiz
            </span>
            <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
// 'use client';

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { supabase } from "../supabase/supabaseClient";
// import Link from "next/link";
// import Image from "next/image";
// import { Heart } from "lucide-react";
// import ecouteImg from "../assets/img/ecoute2.png";

// export default function ArticlePage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id") ?? null;

//   const [article, setArticle] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);

//   // Fonction pour récupérer toutes les données
//   const fetchArticleData = async () => {
//     if (!id) return;

//     const { data: articleData, error: articleError } = await supabase
//       .from("articles")
//       .select("*, article_like_counts(like_count)")
//       .eq("id", id)
//       .single();

//     if (articleError) {
//       console.error("Erreur article :", articleError);
//       return;
//     }
//     setArticle(articleData);
//     setLikeCount(articleData.article_like_counts?.like_count ?? 0);

//     const { data: userData, error: userError } = await supabase.auth.getUser();
//     if (userError || !userData?.user?.id) {
//       console.warn("Utilisateur non connecté ou erreur :", userError);
//       return;
//     }

//     const uid = userData.user.id;
//     setUserId(uid);

//     const { data: likeData, error: likeCheckError } = await supabase
//       .from("likes")
//       .select("*")
//       .eq("user_id", uid)
//       .eq("content_id", id)
//       .eq("content_type", "article");

//     if (!likeCheckError) {
//       setLiked(likeData?.length > 0);
//     }
//   };

//   useEffect(() => {
//     fetchArticleData();
//   }, [id]);

//   const handleToggleLike = async () => {
//     if (!userId || !id) return;

//     if (liked) {
//       const { error: deleteError } = await supabase
//         .from("likes")
//         .delete()
//         .eq("user_id", userId)
//         .eq("content_id", id)
//         .eq("content_type", "article");

//       if (deleteError) {
//         console.error("Erreur suppression like :", deleteError.message || deleteError);
//         return;
//       }
//     } else {
//       const { error: insertError } = await supabase
//         .from("likes")
//         .insert([{ user_id: userId, content_id: id, content_type: "article" }]);

//       if (insertError) {
//         console.error("Erreur ajout like :", insertError.message || insertError);
//         return;
//       }
//     }

//     // Refresh les données à jour
//     fetchArticleData();
//   };

//   if (!article) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500">
//         Chargement...
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen min-h-screen bg-white text-gray-800 px-4">
//       {article.image_url && (
//         <img
//           src={article.image_url}
//           alt="Article"
//           className="rounded-b-xl mb-6 w-full object-cover max-h-[260px]"
//         />
//       )}

//       <div className="flex items-center justify-between mb-2">
//         <h1 className="text-2xl font-bold">{article.title}</h1>
//         <button onClick={handleToggleLike}>
//           <Heart fill={liked ? "red" : "none"} color="red" />
//         </button>
//       </div>

//       <p className="text-sm text-gray-500 mb-4">{likeCount} ❤️</p>

//       <div className="space-y-4 text-base leading-relaxed">
//         {article.content?.split("\n").map((para, i) => (
//           <p key={i}>
//             {para.trim().startsWith("*") ? (
//               <strong>{para.replace("*", "").trim()}</strong>
//             ) : (
//               para
//             )}
//           </p>
//         ))}
//       </div>

//       <div className="mt-10 pb-18">
//         <Link href="/quiz">
//           <div className="flex items-center bg-[#E9C4DE] h-[89px] rounded-[8px] px-4 shadow-sm hover:shadow-md transition-shadow">
//             <Image
//               src={ecouteImg}
//               alt="Illustration quiz"
//               width={100}
//               height={100}
//               className="object-cover"
//             />
//             <span className="ml-4 flex-1 text-white font-medium">
//               Effectuez le quiz
//             </span>
//             <span className="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4 text-black"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//               </svg>
//             </span>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }
