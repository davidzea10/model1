/**
 * Vercel Serverless Function : proxy POST /api/predict vers l'API Render.
 * Variable d'environnement requise : MODEL_API_URL (ex. https://model1-xxfn.onrender.com)
 */
const MODEL_API_URL = process.env.MODEL_API_URL || "https://model1-xxfn.onrender.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Method Not Allowed" });
  }

  try {
    const url = `${MODEL_API_URL.replace(/\/$/, "")}/predict`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });
    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Model API error:", err.message);
    res.status(502).json({
      detail: "Impossible de joindre l'API modèle. Vérifiez MODEL_API_URL.",
    });
  }
}
