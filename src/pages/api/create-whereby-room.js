export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const apiKey = process.env.WHEREBY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API Whereby manquante" });
  }

  // Optionnel : tu peux recevoir des paramètres dans le body (ex: endDate)
  const { endDate } = req.body;

  try {
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        endDate: endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2h par défaut
        fields: ["hostRoomUrl", "viewerRoomUrl"]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.message || "Erreur API Whereby" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
} 