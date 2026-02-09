"""
API de prédiction ostéoporose — charge le modèle et expose POST /predict.
À déployer sur Render.
"""
import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ostéoporose API", version="1.0")

# CORS : autoriser les appels depuis le frontend/backend Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossier des modèles (relatif à l'exécution)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# Objets chargés au démarrage
model = None
scaler = None
selector = None
config = None


def load_artifacts():
    global model, scaler, selector, config
    model = joblib.load(os.path.join(MODEL_DIR, "model.joblib"))
    scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.joblib"))
    selector = joblib.load(os.path.join(MODEL_DIR, "selector.joblib"))
    with open(os.path.join(MODEL_DIR, "config.json"), "r", encoding="utf-8") as f:
        config = json.load(f)


@app.on_event("startup")
def startup():
    load_artifacts()


# Colonnes attendues (comme dans le notebook)
FEATURE_KEYS = [
    "Age", "Gender", "Hormonal Changes", "Family History", "Race/Ethnicity",
    "Body Weight", "Calcium Intake", "Vitamin D Intake", "Physical Activity",
    "Smoking", "Prior Fractures",
]


def _normalize_body(body: dict) -> dict:
    """Accepte clés avec espaces ou underscores, renvoie dict avec clés notebook."""
    mapping = {k.replace(" ", "_").replace("/", "_"): k for k in FEATURE_KEYS}
    out = {}
    for k, v in body.items():
        norm = k.replace(" ", "_").replace("/", "_")
        if norm in mapping:
            out[mapping[norm]] = v
        elif k in FEATURE_KEYS:
            out[k] = v
    return out


@app.get("/")
def root():
    return {
        "message": "API Prédiction Ostéoporose",
        "docs": "/docs",
        "health": "/health",
        "predict": "POST /predict",
    }


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict")
def predict_raw(body: dict):
    if model is None or scaler is None or selector is None or config is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    try:
        row = _normalize_body(body)
        if len(row) != len(FEATURE_KEYS):
            missing = set(FEATURE_KEYS) - set(row.keys())
            raise HTTPException(status_code=400, detail=f"Champs manquants: {list(missing)}")
        df = pd.DataFrame([row])
        colonnes_cat = config["colonnes_cat"]
        columns_encoded = config["columns_encoded"]
        n_features_in = config["n_features_in"]

        patient_enc = pd.get_dummies(df, columns=colonnes_cat, drop_first=True)
        patient_enc = patient_enc.reindex(columns=columns_encoded, fill_value=0)
        patient_scaled = scaler.transform(patient_enc)
        if patient_scaled.shape[1] != n_features_in:
            patient_scaled = patient_scaled[:, :n_features_in]
        patient_sel = selector.transform(patient_scaled)
        pred = int(model.predict(patient_sel)[0])
        resultat = "Oui" if pred == 1 else "Non"
        proba = None
        if hasattr(model, "predict_proba"):
            proba = float(model.predict_proba(patient_sel)[0][1])
        return {"prediction": resultat, "class": pred, "probability": proba}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
