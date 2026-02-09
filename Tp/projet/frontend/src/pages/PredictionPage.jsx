import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { getFacteurs } from "../utils/facteurs";
import { getConseils } from "../utils/conseils";
import { generatePdf } from "../utils/pdfReport";
import { getProfilRisqueBars } from "../utils/patientCharts";

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

export default function PredictionPage() {
  const location = useLocation();
  const { addPrediction } = useHistory();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const replay = location.state?.replayForm;

  useEffect(() => {
    if (replay && typeof replay === "object") {
      setForm((prev) => ({ ...prev, ...replay }));
      setResult(location.state?.replayResult ?? null);
    }
  }, [replay, location.state?.replayResult]);

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
      addPrediction(form, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    const facteurs = getFacteurs(form, result.class === 1);
    const conseils = getConseils(form, result.class === 1);
    generatePdf(form, result, conseils, facteurs);
  };

  const facteurs = result ? getFacteurs(form, result.class === 1) : [];
  const conseils = result ? getConseils(form, result.class === 1) : [];
  const probPct = result?.probability != null ? Math.round(result.probability * 100) : 0;
  const profilBars = result ? getProfilRisqueBars(form) : [];

  return (
    <div className="page-prediction">
      <div className="page-head animate-on-scroll">
        <h1>Nouvelle prédiction</h1>
        <p>Renseignez le profil pour obtenir le risque et les conseils.</p>
      </div>

      <div className="prediction-grid">
        <section className="card form-card">
          <h2>Profil patient</h2>
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
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Calcul en cours…" : "Lancer la prédiction"}
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
        </section>

        <section className="results-column">
          {result && (
            <>
              <div className="card result-card">
                <h2>Résultat</h2>
                <div className={`result-badge ${result.class === 1 ? "risk" : "no-risk"}`}>
                  Risque : {result.prediction}
                </div>
                {result.probability != null && (
                  <div className="gauge-wrap">
                    <p className="gauge-label">Probabilité de risque</p>
                    <div className="gauge-bar">
                      <div
                        className="gauge-fill"
                        style={{
                          width: `${probPct}%`,
                          backgroundColor: result.class === 1 ? "var(--risk)" : "var(--success)",
                        }}
                      />
                    </div>
                    <p className="gauge-value">{probPct} %</p>
                  </div>
                )}
                <button type="button" className="btn btn-outline btn-sm" onClick={handleExportPdf}>
                  Télécharger le rapport PDF
                </button>
              </div>

              {profilBars.length > 0 && (
                <div className="card chart-card patient-chart">
                  <h3>Profil de risque du patient</h3>
                  <p className="chart-desc">Indicateurs dérivés du profil (0–100 %).</p>
                  <div className="patient-bars">
                    {profilBars.map((bar) => (
                      <div key={bar.id} className="patient-bar-row">
                        <span className="patient-bar-label">{bar.label}</span>
                        <div className="patient-bar-track">
                          <div
                            className="patient-bar-fill"
                            style={{
                              width: `${bar.value}%`,
                              backgroundColor:
                                bar.value >= 60 ? "var(--risk)" : bar.value >= 40 ? "#e6a23c" : "var(--success)",
                            }}
                          />
                        </div>
                        <span className="patient-bar-value">{bar.value} %</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {facteurs.length > 0 && (
                <div className="card chart-card">
                  <h3>Impact des facteurs sur la prédiction</h3>
                  <div className="facteurs-bars">
                    {facteurs.map((f, i) => (
                      <div key={i} className={`facteur-bar-row sens-${f.sens}`}>
                        <span className="facteur-bar-label">{f.facteur}</span>
                        <div className="facteur-bar-track">
                          <div
                            className="facteur-bar-fill"
                            style={{
                              width: f.sens === "risque" ? "85%" : f.sens === "protecteur" ? "75%" : "50%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {facteurs.length > 0 && (
                <div className="card">
                  <h3>Facteurs ayant influencé la prédiction</h3>
                  <ul className="facteurs-list">
                    {facteurs.map((f, i) => (
                      <li key={i} className={`facteur sens-${f.sens}`}>
                        <strong>{f.facteur}</strong> ({f.valeur}) — {f.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conseils.length > 0 && (
                <div className="card conseils-card">
                  <h3>Conseils personnalisés</h3>
                  <ul className="conseils-list">
                    {conseils.map((c, i) => (
                      <li key={i}>{c.texte}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          {!result && !loading && (
            <div className="card card-placeholder">
              <p>Remplissez le formulaire et cliquez sur « Lancer la prédiction » pour afficher le résultat, les facteurs explicatifs et les conseils.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
