export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-2xl w-full text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-sm">
          Bienvenue sur Mon App Média
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Plateforme éducative et interactive pour partager des articles, vidéos et organiser des lives en toute simplicité.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          Accéder au tableau de bord
        </a>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">📝 Articles</h2>
            <p className="text-gray-600">Publiez et partagez des articles enrichis d'images pour informer et inspirer votre communauté.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">🎥 Vidéos</h2>
            <p className="text-gray-600">Ajoutez des vidéos éducatives ou créatives pour dynamiser vos contenus et vos échanges.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">🔴 Lives</h2>
            <p className="text-gray-600">Organisez des lives interactifs avec Whereby pour échanger en direct avec votre audience.</p>
          </div>
        </div>

        <footer className="mt-16 text-gray-400 text-sm">
          © {new Date().getFullYear()} Mon App Média — Plateforme éducative
        </footer>
      </div>
    </main>
  );
} 