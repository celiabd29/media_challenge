// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// // import { Search } from 'lucide-react'
// // import BottomNav from '../components/BottomNav'
// import Navigation from "./Navigation";
// import SearchBar from "../components/SearchBar";
// import BottomNavbar from "./BottomNavbar";

// export default function Recherche() {
//   const [selectedTab, setSelectedTab] = useState("Tout");
//   const [query, setQuery] = useState("");

//   return (
//     <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
//       {/* En‐tête */}
//       <header className="flex items-center justify-between mb-4">
//         <h1 className="text-black font-medium text-2xl leading-6">Favoris</h1>
//         <button aria-label="Favoris" className="p-2">
//           {/* <Bookmark size={24} /> */}
//         </button>
//       </header>

//       <SearchBar query={query} setQuery={setQuery} />

//       {/* Tabs de filtre */}
//       <Navigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

//       {/* Espace principal (au besoin flex-1 pour forcer le stretch) */}
//       <section className="flex-1 overflow-y-auto">
//         {/* … ici tes catégories ou autres contenus … */}
//       </section>

//       {/* Bottom nav fixe */}
//       <div className="fixed bottom-0 left-0 right-0">
//         {/*
//          */}
//       </div>
//       <BottomNavbar />
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
// Ces imports seront réactivés après vérification
// import Navigation from './Navigation';
// import SearchBar from '../components/SearchBar';
// import BottomNavbar from './BottomNavbar';

export default function Favoris() {
  const [selectedTab, setSelectedTab] = useState("Tout");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-white px-4 py-6">
      {/* En-tête */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-black font-medium text-2xl leading-6">Favoris</h1>
        <button aria-label="Favoris" className="p-2">
          {/* Bouton d’action à définir */}
        </button>
      </header>

      {/* Barre de recherche */}
      {/* <SearchBar query={query} setQuery={setQuery} /> */}

      {/* Onglets de filtre */}
      {/* <Navigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> */}

      {/* Contenu principal */}
      <section className="flex-1 overflow-y-auto">
        <p className="text-gray-600 text-center mt-10">
          Aucun favori pour le moment.
        </p>
      </section>

      {/* Barre de navigation en bas */}
      {/* <BottomNavbar /> */}
    </div>
  );
}
