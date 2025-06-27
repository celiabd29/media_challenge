"use client";

import { Suspense } from "react";
import QuizPage from "../../components/QuizPage";

export default function QuizWrapper() {
  return (
    <Suspense fallback={<p>Chargement du quiz...</p>}>
      <QuizPage />
    </Suspense>
  );
}
