import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import logoImg from "../../logo.jpg";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  useScrollAnimation();

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const onEscape = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logoImg} alt="OstéoPrédict" className="logo-img" />
          <span>OstéoPrédict</span>
        </Link>

        <button
          type="button"
          className="hamburger"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Accueil
          </NavLink>
          <NavLink to="/prediction" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Prédiction
          </NavLink>
          <NavLink to="/historique" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Historique
          </NavLink>
          <NavLink to="/tableau-de-bord" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Tableau de bord
          </NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            À propos
          </NavLink>
        </nav>

        {menuOpen && <div className="nav-overlay" aria-hidden onClick={closeMenu} />}
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>OstéoPrédict — Outil d’évaluation du risque d’ostéoporose (à usage pédagogique).</span>
        <Link to="/a-propos" className="footer-link">À propos</Link>
      </footer>
    </div>
  );
}
