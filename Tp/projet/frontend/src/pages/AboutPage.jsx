import { useEffect } from "react";

const WHATSAPP_NUMBER = "243817089087";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-about">
      <section className="about-hero animate-on-scroll">
        <h1>À propos d’OstéoPrédict</h1>
        <p className="about-hero-sub">
          Un outil d’évaluation du risque d’ostéoporose, conçu dans un cadre pédagogique (systèmes intelligents).
        </p>
      </section>

      <section className="about-section animate-on-scroll">
        <h2>Le projet</h2>
        <p>
          OstéoPrédict est une application web qui combine <strong>apprentissage automatique</strong> et
          interface utilisateur pour estimer le risque d’ostéoporose à partir du profil du patient :
          âge, genre, antécédents, mode de vie (activité physique, calcium, vitamine D, tabac, etc.).
        </p>
        <p>
          Le modèle est entraîné sur des données de santé, déployé via une API (Render), et l’application
          offre prédiction, probabilité, facteurs explicatifs, conseils personnalisés et export PDF.
        </p>
      </section>

      <section className="about-section animate-on-scroll">
        <h2>Technologies</h2>
        <ul className="about-tech-list">
          <li>Modèle ML (XGBoost, scikit-learn) et API FastAPI (Python)</li>
          <li>Frontend React (Vite) avec React Router</li>
          <li>Backend proxy Node.js / Vercel Serverless</li>
          <li>Hébergement : Render (API), Vercel (frontend)</li>
        </ul>
      </section>

      <section className="about-section about-author animate-on-scroll">
        <h2>Contact & auteur</h2>
        <div className="author-card">
          <div className="author-info">
            <p className="author-name">DEBUZE David</p>
            <p className="author-role">Développement et conception — Projet pédagogique L4</p>
            <a href={`mailto:daviddebuze020@gmail.com`} className="author-email">
              daviddebuze020@gmail.com
            </a>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            aria-label="Contacter par WhatsApp"
          >
            <span className="whatsapp-icon" aria-hidden>WhatsApp</span>
            0817089087
          </a>
        </div>
      </section>

      <section className="about-section animate-on-scroll">
        <h2>Disclaimer</h2>
        <p>
          Cet outil est à <strong>usage pédagogique</strong> uniquement. Il ne remplace pas un avis médical.
          Pour toute question de santé, consultez un professionnel de santé.
        </p>
      </section>
    </div>
  );
}
