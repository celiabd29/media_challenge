export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const apiKey = process.env.WHEREBY_API_KEY;

  // Log pour debug
  console.log("🔐 API KEY présente :", !!apiKey);

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API Whereby manquante" });
  }

  // Optionnel : tu peux recevoir une endDate personnalisée
  const { endDate } = req.body;

  try {
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        endDate: endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
        fields: ["hostRoomUrl", "viewerRoomUrl"]
      })
    });

    // Vérification et log en cas d'erreur
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API Whereby :", errorText);
      return res.status(500).json({ error: "Whereby API error: " + errorText });
    }

    const data = await response.json();
    console.log("✅ Lien Whereby généré :", data);

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Exception serveur :", err);
    return res.status(500).json({ error: err.message });
  }
}
