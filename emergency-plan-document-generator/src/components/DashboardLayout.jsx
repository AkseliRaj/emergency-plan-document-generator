import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import menuIcon from "../assets/svg/menu-icon.svg";
import closeIcon from "../assets/svg/close-icon.svg";
import logoImage from "../assets/webp/Logo.webp";
import "./DashboardLayout.css";

const PLACEHOLDER_LINKS = [
  { to: "/dashboard", label: "Yleisnäkymä" },
  { to: "/dashboard/plans", label: "Uusi pelastussuunnitelma" },
  { to: "/dashboard/drafts", label: "Luonnokset" },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign out failed", err);
    }
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-topbar">
        <button
          type="button"
          className="dashboard-menu-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Sulje valikko" : "Avaa valikko"}
          aria-expanded={sidebarOpen}
        >
          <span className="dashboard-menu-icon" aria-hidden>
            <img
              src={sidebarOpen ? closeIcon : menuIcon}
              alt=""
              className="dashboard-menu-icon-image"
            />
          </span>
        </button>
        <button
          type="button"
          className="dashboard-signout"
          onClick={handleSignOut}
        >
          Kirjaudu ulos
        </button>
      </header>

      <aside className={`dashboard-sidebar ${sidebarOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="dashboard-sidebar-logo">
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
            <img src={logoImage} alt="Pelastussuunnitelma" className="dashboard-logo-image" />
          </Link>
        </div>
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-list">
            {PLACEHOLDER_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="dashboard-nav-link" onClick={() => setSidebarOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
