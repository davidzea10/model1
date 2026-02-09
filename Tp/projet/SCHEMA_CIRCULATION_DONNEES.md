# Schéma de circulation des données — Prédiction ostéoporose

## Vue d’ensemble

```
┌─────────────────┐      POST /api/predict       ┌─────────────────┐      POST /predict        ┌─────────────────┐
│   FRONTEND      │  ─────────────────────────►  │    BACKEND      │  ─────────────────────►  │  API MODÈLE     │
│   (React)       │   JSON (Age, Gender, …)     │   (Node/Express) │   même JSON              │  (Render)       │
│   localhost:   │                              │   localhost:    │                          │  model1-xxfn    │
│   5173          │  ◄─────────────────────────  │   3001          │  ◄─────────────────────  │  .onrender.com  │
└─────────────────┘   { prediction, probability } └─────────────────┘   { prediction, … }     └─────────────────┘
```

---

## Étapes détaillées

| Étape | Où | Quoi |
|-------|-----|------|
| 1 | **Frontend** (navigateur) | L’utilisateur remplit le formulaire (Âge, Genre, etc.) et clique sur « Prédire le risque ». |
| 2 | **Frontend** → Backend | `fetch('/api/predict', { method: 'POST', body: JSON.stringify(form) })` — en dev le proxy Vite envoie `/api` vers `http://localhost:3001`. |
| 3 | **Backend** (Node) | Reçoit le JSON sur `POST /api/predict`, puis appelle `https://model1-xxfn.onrender.com/predict` avec le même body. |
| 4 | **API Render** (Python/FastAPI) | Préprocessing (encodage, scale, sélection), puis `model.predict()` / `predict_proba()`, renvoie `{ prediction: "Oui"/"Non", class, probability }`. |
| 5 | **Backend** → Frontend | Le backend renvoie tel quel la réponse de l’API Render au navigateur. |
| 6 | **Frontend** | Affiche le résultat (Oui/Non + probabilité). |

---

## Où l’API est connectée dans le code

| Fichier | Rôle |
|---------|------|
| **`frontend/src/App.jsx`** | Envoie le formulaire vers `/api/predict` (ligne ~37 : `fetch(\`${API_BASE}/api/predict\`, …)`). C’est la **connexion frontend → backend**. |
| **`frontend/vite.config.js`** | En dev, `proxy: { "/api" → "http://localhost:3001" }` : les appels `/api/*` partent vers le backend. |
| **`backend/server.js`** | Définit `MODEL_API_URL = "https://model1-xxfn.onrender.com"` (ou `process.env.MODEL_API_URL`). La route `POST /api/predict` appelle `MODEL_API_URL/predict` et renvoie la réponse. C’est la **connexion backend → API Render**. |

---

## Résumé

- **Frontend** : formulaire → `POST /api/predict` (body = JSON patient).
- **Backend** : reçoit ce JSON, le transmet à l’API Render, renvoie la prédiction.
- **API Render** : exécute le modèle et renvoie `prediction` + `probability`.

L’API de prédiction (Render) est donc utilisée **via le backend** ; le frontend ne parle qu’au backend.
