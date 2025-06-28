"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Edit3, LogOut, ArrowRight } from "lucide-react";
import Navbar from "@/components/BottomNavbar";

export default function EspacePro() {
  const [userData, setUserData] = useState(null);
  const [visios, setVisios] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndVisios = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return router.push("/login");

      const { data: user } = await supabase
        .from("users")
        .select("id, nom, email, avatar_url, role")
        .eq("id", userId)
        .maybeSingle();

      if (!user || user.role !== "sexologue") {
        router.push("/login");
        return;
      }

      setUserData(user);

      const { data: visiosData } = await supabase
        .from("visios")
        .select("*")
        .eq("author_id", user.id)
        .order("date", { ascending: true });

      setVisios(visiosData || []);
    };

    fetchUserAndVisios();
  }, [router]);
  const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !userData?.id) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${userData.id}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload dans le bucket "avatars"
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    alert("Erreur lors de l’upload 😞");
    return;
  }

  // Récupérer l'URL publique
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const publicUrl = data.publicUrl;

  // Mettre à jour dans la table "users"
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", userData.id);

  if (!updateError) {
    setUserData((prev) => ({ ...prev, avatar_url: publicUrl }));
    setToastMessage("✅ Avatar mis à jour !");
    setTimeout(() => setToastMessage(""), 3000);
  }
};

  const handleDeleteVisio = async (visioId, imageUrl) => {
    const confirm = window.confirm("Supprimer cette visio ?");
    if (!confirm) return;

    if (imageUrl) {
      const path = imageUrl.split("/").pop();
      await supabase.storage.from("visios").remove([path]);
    }

    const { error } = await supabase
      .from("visios")
      .delete()
      .eq("id", visioId);

    if (!error) {
      setVisios((prev) => prev.filter((v) => v.id !== visioId));
      setToastMessage("✅ Visio supprimée");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!userData) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {toastMessage}
        </div>
      )}

      {/* Bandeau haut + avatar comme avant */}
<div className="w-full h-40 bg-[#C9DAF8] relative">
  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
    <div className="relative group">
      <img
        src={userData.avatar_url || "/avatar-placeholder.png"}
        alt="Avatar"
        className="w-24 h-24 rounded-full border-4 border-white object-cover"
      />
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer hover:bg-gray-100"
      >
        <Edit3 size={16} className="text-gray-700" />
      </label>
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  </div>
</div>


      <div className="mt-20 px-6 max-w-md self-center w-full pb-28">

        <h2 className="text-xl font-semibold text-center text-gray-900 mb-1">
          {userData.nom}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Coordonnées et identifiants
        </p>

        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Prénom et Nom</label>
          <input
            type="text"
            value={userData.nom}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded-md mt-1 bg-white text-gray-600"
          />
        </div>

        {/* Bouton publier une visio */}
        <p className="text-sm text-gray-700 font-medium mt-6 mb-2">Créer une visio</p>
        <div
          onClick={() => router.push("/espace-pro/creer-visio")}
          className="flex items-center justify-between border px-4 py-3 rounded-xl cursor-pointer shadow-sm bg-white hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <Edit3 size={18} />
            Publier une visio
          </div>
          <ArrowRight size={18} className="text-blue-600" />
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full border-2 border-blue-500 text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition"
        >
          Déconnexion
        </button>

        {/* Visios créées */}
        {visios.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">Mes visios</h2>
            <div className="space-y-4">
              {visios.map((v) => (
                <div key={v.id} className="border rounded-xl p-4 shadow-sm bg-white">
                  {v.image_url && (
                    <img
                      src={v.image_url}
                      alt={v.titre}
                      className="rounded-lg mb-3 h-32 w-full object-cover"
                    />
                  )}
                  <div className="text-sm text-gray-600 mb-1">
                    🕒 {v.heure} &nbsp;📅 {new Date(v.date).toLocaleDateString("fr-FR")}
                  </div>
                  <h3 className="text-md font-semibold text-gray-800">{v.titre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{v.description}</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={v.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700"
                    >
                      Je m’inscris
                    </a>
                    <button
                      onClick={() => handleDeleteVisio(v.id, v.image_url)}
                      className="flex-1 border border-red-500 text-red-600 py-2 rounded-md text-sm font-medium hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Navbar />
    </div>
  );
}
