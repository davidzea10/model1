/**
 * Backend proxy : reçoit le formulaire frontend et appelle l'API modèle sur Render.
 * Variable d'environnement : MODEL_API_URL (ex. https://osteoporosis-api.onrender.com)
 */
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const MODEL_API_URL = process.env.MODEL_API_URL || "http://localhost:8000";

app.use(cors({ origin: true }));
app.use(express.json());

// Santé du backend
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", modelUrl: MODEL_API_URL ? "configured" : "missing" });
});

// Proxy prédiction : POST /api/predict -> MODEL_API_URL/predict
app.post("/api/predict", async (req, res) => {
  try {
    const response = await fetch(`${MODEL_API_URL.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error("Model API error:", err.message);
    res.status(502).json({
      detail: "Impossible de joindre l'API modèle. Vérifiez MODEL_API_URL.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend écoute sur http://localhost:${PORT}`);
  console.log(`MODEL_API_URL = ${MODEL_API_URL}`);
});
