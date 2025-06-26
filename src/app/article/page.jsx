"use client";

import { Suspense } from "react";
import ArticlePage from "../../components/ArticlePage"; // ou autre nom de composant

export default function ArticleWrapper() {
  return (
    <Suspense fallback={<p>Chargement de l'article...</p>}>
      <ArticlePage />
    </Suspense>
  );
}
