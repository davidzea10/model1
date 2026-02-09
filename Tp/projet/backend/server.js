/**
 * Backend proxy : reçoit le formulaire frontend et appelle l'API modèle sur Render.
 * Variable d'environnement : MODEL_API_URL (sinon utilise l'API Render par défaut)
 */
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// ----- CONNEXION API PRÉDICTION (Render) -----
// L'app envoie les données du formulaire vers cette URL pour obtenir la prédiction.
const MODEL_API_URL = process.env.MODEL_API_URL || "https://model1-xxfn.onrender.com";

app.use(cors({ origin: true }));
app.use(express.json());

// Santé du backend
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", modelUrl: MODEL_API_URL ? "configured" : "missing" });
});

// Proxy prédiction : reçoit le JSON du frontend, appelle l'API Render, renvoie la prédiction
app.post("/api/predict", async (req, res) => {
  try {
    const apiUrl = `${MODEL_API_URL.replace(/\/$/, "")}/predict`;
    const response = await fetch(apiUrl, {
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
