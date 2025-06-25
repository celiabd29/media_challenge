// pages/index.jsx
import Image from "next/image";
import BottomNavbar from "../components/BottomNavbar";
import Link from "next/link";

import ecouteImg       from '../assets/img/ecoute2.png';
import emotionImg      from '../assets/img/emotion2.png';
import consentementImg from '../assets/img/consentement2.png';
import puberteImg      from '../assets/img/puberte2.png';
import identiteImg     from '../assets/img/identite.png';
import proImg          from '../assets/img/parler_pro.png';

const categories = [
  { key: 'ecoute',       label: 'Écoute',       image: ecouteImg,       bgColor: 'bg-[#E9C4DE]', href: '/ecoute' },
  { key: 'emotions',     label: 'Émotions',     image: emotionImg,      bgColor: 'bg-[#E0EED0]', href: '/emotions' },
  { key: 'consentement', label: 'Consentement', image: consentementImg, bgColor: 'bg-[#FFCFA6]', href: '/consentement' },
  { key: 'puberte',      label: 'Puberté',      image: puberteImg,      bgColor: 'bg-[#B3D1ED]', href: '/puberte' },
  { key: 'identite',     label: 'Identité',     image: identiteImg,     bgColor: 'bg-[#DDC8FF]', href: '/identite' },
];

export default function Home() {
  const userName = "(nom de utilisateur)"; // À remplacer

  return (
    <main className="min-h-screen bg-white px-4 pb-20">
      {/* HEADER */}
      <header className="pt-8 flex items-center justify-between">
        <p className="text-lg text-gray-700">
          Bonjour <span className="font-semibold">{userName}</span> 👋
        </p>
      </header>

      {/* CARTE “Nouveauté” */}
      <section className="mt-6">
        <div className="relative h-[200px] rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/images/nouveaute.jpg"
            width={310}
            height={160}
            alt="Image Nouveauté"
            className="w-full h-auto"
          />
          <span className="absolute top-4 left-4 bg-[#EAB1D9] text-white text-xs font-medium px-3 py-1 rounded-full">
            Nouveauté
          </span>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="mt-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Catégories</h2>
          <Link href="/recherche" className="text-blue-600 text-sm font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="flex gap-x-6 overflow-x-scroll hide-scrollbar">
          {categories.map(cat => (
            <Link
              key={cat.key}
              href={cat.href}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <div className={`${cat.bgColor} w-[100px] h-[88px] rounded-lg flex items-center justify-center shadow-sm mb-2`}>
                <Image src={cat.image} width={100} height={80} alt={cat.label} />
              </div>
              <p className="text-sm text-gray-700 mb-4 text-center">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA PROFESSIONNEL */}
      <section className="mt-6 mb-8 w-full">
        <div className="relative h-[220px] bg-[#4069E1] rounded-[18px] pl-6 flex items-center overflow-hidden">
          <div className="flex-1 text-white">
            <h3 className="text-2xl font-semibold leading-snug mb-2">
              Besoin de parler à un professionnel ?
            </h3>
            <p className="text-sm pr-4 mb-4">
              Rejoignez un live en groupe pour discuter avec un professionnel bienveillant, à votre rythme.
            </p>
            <Link
              href="/visio"
              className="inline-block bg-white text-[#4069E1] text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Voir les visioconférences
            </Link>
          </div>
          <div className="flex-shrink-0">
            <Image src={proImg} alt="Consultation pro" width={200} className="object-cover" />
          </div>
        </div>
      </section>

      {/* LES PLUS POPULAIRES */}
      <section className="mt-8 mb-8 w-full">
        <h2 className="text-xl font-semibold text-black mb-4">Les plus populaires</h2>
        <p className="text-black">met l'affichage des articles ici</p>
      </section>

      {/* NAVBAR FIXE EN BAS */}
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNavbar />
      </div>
    </main>
  );
}
