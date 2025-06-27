"use client";

import { Suspense } from "react";
import ArticlePage from "@/components/ArticlePage";

export default function ArticleWrapper() {
  return (
    <Suspense fallback={<p>Chargement de l'article...</p>}>
      <ArticlePage />
    </Suspense>
  );
export default function ArticleWrapper() {
  return (
    <Suspense fallback={<p>Chargement de l'article...</p>}>
      <ArticlePage />
    </Suspense>
  );
}
