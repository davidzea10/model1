import { Link } from "react-router-dom";

import osImg from "../../os.png";

export default function HomePage() {
  return (
    <div className="page-home">
      {/* Section dédiée : image à gauche, texte à droite */}
      <section className="section-visual animate-on-scroll" aria-label="Comprendre l'ostéoporose">
        <div className="section-visual-order">
          <img
            src={osImg}
            alt="Comparaison os sain et os atteint d'ostéoporose : structure dense à gauche, structure poreuse à droite"
            className="section-visual-image"
          />
        </div>
        <div className="section-visual-content">
          <h2>Os sain vs ostéoporose</h2>
          <p>
            À gauche, un <strong>os sain</strong> : sa structure est dense, les travées osseuses sont
            serrées et régulières. L’os résiste bien aux chocs et aux chutes.
          </p>
          <p>
            À droite, un os atteint d’<strong>ostéoporose</strong> : la masse osseuse diminue,
            les pores s’agrandissent et la structure se fragilise. Le risque de fracture augmente.
          </p>
          <p>
            Notre outil aide à évaluer ce risque à partir du profil du patient (âge, mode de vie,
            antécédents) et à orienter la prévention ou le suivi.
          </p>
        </div>
      </section>

      <section className="hero animate-on-scroll">
        <h1 className="hero-title">
          Évaluez le risque d’ostéoporose
          <br />
          <span className="hero-sub">en quelques clics</span>
        </h1>
        <p className="hero-desc">
          Outil basé sur un modèle d’apprentissage automatique : renseignez le profil du patient
          et obtenez une prédiction, une probabilité et des conseils personnalisés.
        </p>
        <div className="hero-actions">
          <Link to="/prediction" className="btn btn-primary btn-lg">
            Commencer une prédiction
          </Link>
          <Link to="/historique" className="btn btn-secondary btn-lg">
            Voir l’historique
          </Link>
        </div>
      </section>

      <section className="features animate-on-scroll">
        <h2>Fonctionnalités</h2>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <h3>Prédiction</h3>
            <p>Risque Oui/Non et probabilité à partir des facteurs cliniques et du mode de vie.</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <h3>Explication</h3>
            <p>Les 3 à 5 facteurs qui ont le plus influencé la prédiction (âge, poids, calcium…).</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <h3>Conseils</h3>
            <p>Recommandations personnalisées : alimentation, activité, suivi médical.</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <h3>Rapport PDF</h3>
            <p>Téléchargez un rapport par prédiction (données, résultat, conseils).</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <h3>Historique</h3>
            <p>Consultez et rejoue les dernières prédictions (stockage en session).</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <h3>Tableau de bord</h3>
            <p>Statistiques : nombre de prédictions, répartition Oui/Non, âge moyen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
