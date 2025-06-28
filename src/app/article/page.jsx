"use client";

import { Suspense } from "react";
import ArticlePage from "@/components/ArticlePage";
import NavBar from "@/components/BottomNavbar";

export default function ArticleWrapper() {
  return (
    <Suspense fallback={<p>Chargement de l'article...</p>}>
      <ArticlePage />
      <NavBar />
    </Suspense>
  );
}
