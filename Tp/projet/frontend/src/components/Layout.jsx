import { Link, NavLink, Outlet } from "react-router-dom";

import logoImg from "../../logo.jpg";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <img src={logoImg} alt="OstéoPrédict" className="logo-img" />
          <span>OstéoPrédict</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Accueil
          </NavLink>
          <NavLink to="/prediction" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Prédiction
          </NavLink>
          <NavLink to="/historique" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Historique
          </NavLink>
          <NavLink to="/tableau-de-bord" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Tableau de bord
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>OstéoPrédict — Outil d’évaluation du risque d’ostéoporose (à usage pédagogique).</span>
      </footer>
    </div>
  );
}
