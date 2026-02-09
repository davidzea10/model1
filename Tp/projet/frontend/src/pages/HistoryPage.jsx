import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";

export default function HistoryPage() {
  const { items, clearHistory } = useHistory();

  const handleReplay = (entry) => {
    // Navigation avec state pour préremplir la page Prédiction
    return {
      pathname: "/prediction",
      state: { replayForm: entry.form, replayResult: entry.result },
    };
  };

  return (
    <div className="page-history">
      <div className="page-head">
        <h1>Historique des prédictions</h1>
        <p>Dernières prédictions (stockées en session). Rejoue une prédiction pour revoir le détail.</p>
      </div>

      {items.length === 0 ? (
        <div className="card empty-state">
          <p>Aucune prédiction pour le moment.</p>
          <Link to="/prediction" className="btn btn-primary">
            Faire une prédiction
          </Link>
        </div>
      ) : (
        <>
          <div className="history-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={clearHistory}>
              Effacer l’historique
            </button>
          </div>
          <ul className="history-list">
            {items.map((entry) => (
              <li key={entry.id} className="card history-item">
                <div className="history-meta">
                  <time dateTime={entry.at}>
                    {new Date(entry.at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                  <span className={`badge ${entry.result.class === 1 ? "badge-risk" : "badge-ok"}`}>
                    {entry.result.prediction}
                  </span>
                  {entry.result.probability != null && (
                    <span className="history-proba">
                      {(entry.result.probability * 100).toFixed(0)} %
                    </span>
                  )}
                </div>
                <div className="history-summary">
                  {entry.form.Age} ans, {entry.form.Gender === "Female" ? "F" : "M"},{" "}
                  {entry.form["Physical Activity"] === "Active" ? "actif" : "sédentaire"},{" "}
                  calcium {entry.form["Calcium Intake"] === "Low" ? "faible" : "adéquat"}
                </div>
                <Link to={handleReplay(entry)} className="btn btn-primary btn-sm">
                  Rejouer
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
