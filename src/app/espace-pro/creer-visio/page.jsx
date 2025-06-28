"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabaseClient";

export default function CreerVisio() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lien, setLien] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Génére un lien de visio via API /create-whereby-room
  const generateLink = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/create-whereby-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la génération du lien");
      setLien(data.hostRoomUrl || data.roomUrl || "");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return router.push("/login");

    let imageUrl = null;
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${userId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("visios")
        .upload(filePath, image, { upsert: true });

      if (uploadError) {
        setMessage("❌ Erreur lors de l'upload de l'image");
        return;
      }

      const { data } = supabase.storage
        .from("visios")
        .getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("visios").insert({
      titre,
      description,
      lien,
      date,
      heure,
      image_url: imageUrl,
      author_id: userId,
    });

    if (error) {
      setMessage("❌ Erreur lors de la publication");
    } else {
      router.push("/espace-pro");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white max-w-md mx-auto">
      <button onClick={() => router.back()} className="mb-4 text-sm text-gray-600">
        ← Retour
      </button>
      <h1 className="text-xl font-semibold mb-4">Créer une visio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Titre</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
            placeholder="Écrivez-ici"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
            placeholder="Écrivez-ici"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 flex justify-between items-center">
            Lien de la visioconférence
            <button
              type="button"
              onClick={generateLink}
              disabled={loading}
              className="text-blue-600 text-xs underline ml-2"
            >
              {loading ? "Génération en cours..." : "Générer un lien automatique"}
            </button>
          </label>
          <input
            type="url"
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
            placeholder="https://whereby.com/..."
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Heure</label>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Image de couverture</label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.pdf"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border px-3 py-2 rounded mt-1 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formats : PDF, JPG, PNG ou GIF – 3 Mo max
          </p>
        </div>

        {message && <p className="text-red-600 text-sm">{message}</p>}

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Publier
          </button>
          <button
            type="button"
            onClick={() => router.push("/espace-pro")}
            className="border border-blue-500 text-blue-600 py-2 rounded-md font-semibold hover:bg-blue-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
