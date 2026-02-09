import { useState } from "react";

const initialForm = {
  Age: 45,
  Gender: "Female",
  "Hormonal Changes": "Normal",
  "Family History": "No",
  "Race/Ethnicity": "Caucasian",
  "Body Weight": "Normal",
  "Calcium Intake": "Adequate",
  "Vitamin D Intake": "Sufficient",
  "Physical Activity": "Active",
  Smoking: "No",
  "Prior Fractures": "No",
};

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Erreur API");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Prédiction du risque d&apos;ostéoporose</h1>
      <p className="subtitle">Renseignez les champs pour obtenir une prédiction (modèle ML).</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Âge</label>
          <input
            type="number"
            min={18}
            max={120}
            value={form.Age}
            onChange={(e) => update("Age", Number(e.target.value))}
          />
        </div>

        <div className="row">
          <div className="field">
            <label>Genre</label>
            <select value={form.Gender} onChange={(e) => update("Gender", e.target.value)}>
              <option value="Female">Femme</option>
              <option value="Male">Homme</option>
            </select>
          </div>
          <div className="field">
            <label>Changements hormonaux</label>
            <select
              value={form["Hormonal Changes"]}
              onChange={(e) => update("Hormonal Changes", e.target.value)}
            >
              <option value="Normal">Normal</option>
              <option value="Postmenopausal">Post-ménopause</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Antécédents familiaux</label>
            <select
              value={form["Family History"]}
              onChange={(e) => update("Family History", e.target.value)}
            >
              <option value="No">Non</option>
              <option value="Yes">Oui</option>
            </select>
          </div>
          <div className="field">
            <label>Origine / ethnicité</label>
            <select
              value={form["Race/Ethnicity"]}
              onChange={(e) => update("Race/Ethnicity", e.target.value)}
            >
              <option value="Asian">Asiatique</option>
              <option value="Caucasian">Caucasienne</option>
              <option value="African American">Afro-américaine</option>
              <option value="Hispanic">Hispanique</option>
              <option value="Other">Autre</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Poids corporel</label>
            <select
              value={form["Body Weight"]}
              onChange={(e) => update("Body Weight", e.target.value)}
            >
              <option value="Underweight">Insuffisant</option>
              <option value="Normal">Normal</option>
              <option value="Overweight">Surpoids</option>
            </select>
          </div>
          <div className="field">
            <label>Apport en calcium</label>
            <select
              value={form["Calcium Intake"]}
              onChange={(e) => update("Calcium Intake", e.target.value)}
            >
              <option value="Low">Faible</option>
              <option value="Adequate">Adéquat</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Vitamine D</label>
            <select
              value={form["Vitamin D Intake"]}
              onChange={(e) => update("Vitamin D Intake", e.target.value)}
            >
              <option value="Insufficient">Insuffisant</option>
              <option value="Sufficient">Suffisant</option>
            </select>
          </div>
          <div className="field">
            <label>Activité physique</label>
            <select
              value={form["Physical Activity"]}
              onChange={(e) => update("Physical Activity", e.target.value)}
            >
              <option value="Sedentary">Sédentaire</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Tabagisme</label>
            <select value={form.Smoking} onChange={(e) => update("Smoking", e.target.value)}>
              <option value="No">Non</option>
              <option value="Yes">Oui</option>
            </select>
          </div>
          <div className="field">
            <label>Fractures antérieures</label>
            <select
              value={form["Prior Fractures"]}
              onChange={(e) => update("Prior Fractures", e.target.value)}
            >
              <option value="No">Non</option>
              <option value="Yes">Oui</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Calcul…" : "Prédire le risque"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Résultat</h3>
          <div className={`prediction ${result.class === 1 ? "risk" : "no-risk"}`}>
            Risque d&apos;ostéoporose : {result.prediction}
          </div>
          {result.probability != null && (
            <div className="probability">
              Probabilité estimée : {(result.probability * 100).toFixed(1)} %
            </div>
          )}
        </div>
      )}
    </div>
  );
}
