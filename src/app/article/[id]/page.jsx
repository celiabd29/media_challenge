'use client';

import { Suspense } from "react";
import { useParams } from "next/navigation";
import ArticlePage from "@/components/ArticlePage";

export default function ArticleWrapper() {
  const params = useParams();
  const id = params.id;

  return (
    <Suspense fallback={<p className="text-center mt-10 text-white">Chargement de l'article...</p>}>
      <ArticlePage id={id} />
    </Suspense>
  );
}
