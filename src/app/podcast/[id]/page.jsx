'use client';

import { Suspense } from "react";
import Podcast from "@/components/Podcast";
import BottomNavbar from "@/components/BottomNavbar";

export default function PodcastWrapper() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-white">Chargement de podcast...</p>}>
      <Podcast />
      <BottomNavbar />
    </Suspense>
  );
}
