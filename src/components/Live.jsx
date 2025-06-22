"use client";
import React, { useState } from "react";

export default function Live() {
  const [roomUrl, setRoomUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Génère une salle Whereby via l'API Next.js
  const generateRoom = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    setRoomUrl("");
    try {
      const res = await fetch("/api/create-whereby-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la salle");
      setRoomUrl(data.hostRoomUrl || data.roomUrl || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Utilise un lien entré manuellement
  const handleJoin = (e) => {
    e.preventDefault();
    setError("");
    if (inputUrl.startsWith("https://whereby.com/")) {
      setRoomUrl(inputUrl);
      setCopied(false);
    } else {
      setError("Le lien doit commencer par https://whereby.com/");
    }
  };

  // Copie le lien dans le presse-papier
  const handleCopy = async () => {
    if (roomUrl) {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Lancer un Live</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {!roomUrl && (
          <>
            <button
              onClick={generateRoom}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition mb-4 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Création de la salle..." : "Lancer un live"}
            </button>
            <div className="my-4 text-gray-500">ou</div>
            <form onSubmit={handleJoin} className="flex flex-col items-center gap-2">
              <input
                type="text"
                placeholder="Colle un lien Whereby (https://whereby.com/...)"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Rejoindre ce live
              </button>
            </form>
          </>
        )}
        {roomUrl && (
          <>
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-2">Lien du live :</div>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={roomUrl}
                  readOnly
                  className="border rounded px-2 py-1 w-64 text-center"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <iframe
                src={roomUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                className="w-full h-[400px] rounded border"
                title="Live Whereby"
              ></iframe>
            </div>
            <button
              onClick={() => setRoomUrl("")}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Quitter le live / Changer de salle
            </button>
          </>
        )}
      </div>
    </div>
  );
}
