# Projet Ostéoporose — Backend + Frontend

- **Backend** (Node/Express) : proxy vers l’API modèle hébergée sur Render.
- **Frontend** (React/Vite) : formulaire patient et affichage de la prédiction.

## 1. Héberger l’API sur Render

1. Crée un **Web Service** sur [Render](https://render.com).
2. Connecte le dépôt Git et choisis **Root Directory** : `Tp/model-service` (ou le dossier qui contient `app.py` et `requirements.txt`).
3. Build : `pip install -r requirements.txt`
4. Start : `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Note l’URL du service (ex. `https://osteoporosis-api.onrender.com`).

## 2. Lancer en local

### Backend

```bash
cd backend
npm install
# Optionnel : créer .env avec MODEL_API_URL=http://localhost:8000 si l’API Python tourne en local
# Sinon mets l’URL Render une fois déployée
set MODEL_API_URL=https://osteoporosis-api.onrender.com
node server.js
```

Le backend écoute sur le port **3001** (ou `PORT` si défini).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvre http://localhost:5173. Le formulaire envoie les requêtes vers le backend (proxy Vite → `http://localhost:3001`).

## 3. Tester l’API une fois sur Render

- **Santé** : `GET https://ton-api.onrender.com/health`
- **Prédiction** : `POST https://ton-api.onrender.com/predict` avec un JSON contenant les champs : `Age`, `Gender`, `Hormonal Changes`, `Family History`, `Race/Ethnicity`, `Body Weight`, `Calcium Intake`, `Vitamin D Intake`, `Physical Activity`, `Smoking`, `Prior Fractures`.

En mettant `MODEL_API_URL` sur l’URL Render dans le backend, le frontend en local utilisera déjà l’API hébergée.

## 4. Déploiement sur Vercel

- Déployer le **frontend** (dossier `frontend`) comme site statique Vite.
- Déployer le **backend** (dossier `backend`) comme serverless ou Node server ; définir la variable d’environnement `MODEL_API_URL` avec l’URL Render.
