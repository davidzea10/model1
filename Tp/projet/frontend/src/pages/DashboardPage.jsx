import { useHistory } from "../context/HistoryContext";

export default function DashboardPage() {
  const { items } = useHistory();

  const total = items.length;
  const yesCount = items.filter((e) => e.result.class === 1).length;
  const noCount = total - yesCount;
  const yesPct = total ? Math.round((yesCount / total) * 100) : 0;
  const noPct = total ? Math.round((noCount / total) * 100) : 0;
  const ages = items.map((e) => Number(e.form.Age)).filter((n) => !Number.isNaN(n));
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;

  return (
    <div className="page-dashboard">
      <div className="page-head animate-on-scroll">
        <h1>Tableau de bord</h1>
        <p>Statistiques sur les prédictions de la session (aucune donnée personnelle identifiante).</p>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Prédictions réalisées</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{yesCount}</span>
          <span className="stat-label">Risque « Oui »</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{noCount}</span>
          <span className="stat-label">Risque « Non »</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{avgAge ?? "—"}</span>
          <span className="stat-label">Âge moyen des patients</span>
        </div>
      </div>

      {total > 0 && (
        <div className="card chart-card">
          <h2>Répartition Oui / Non</h2>
          <div className="bar-chart">
            <div className="bar-row">
              <span className="bar-label">Oui (risque)</span>
              <div className="bar-track">
                <div
                  className="bar-fill bar-risk"
                  style={{ width: `${yesPct}%` }}
                />
              </div>
              <span className="bar-pct">{yesPct} %</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">Non</span>
              <div className="bar-track">
                <div
                  className="bar-fill bar-ok"
                  style={{ width: `${noPct}%` }}
                />
              </div>
              <span className="bar-pct">{noPct} %</span>
            </div>
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="card empty-state">
          <p>Aucune donnée pour afficher les statistiques. Effectuez des prédictions pour alimenter le tableau de bord.</p>
        </div>
      )}
    </div>
  );
}
