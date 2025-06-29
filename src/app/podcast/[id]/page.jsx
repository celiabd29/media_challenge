'use client';

import { use } from 'react';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import Podcast from '@/components/Podcast';

export default function PodcastPage() {
  const params = useParams();
  const id = params.id;

  return (
    <Suspense fallback={<p className="text-center mt-10 text-white">Chargement de podcast...</p>}>
      <Podcast id={id} />
    </Suspense>
  );
}
