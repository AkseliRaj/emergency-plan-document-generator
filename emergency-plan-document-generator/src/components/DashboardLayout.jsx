import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import "./DashboardLayout.css";

const PLACEHOLDER_LINKS = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/plans", label: "Create new document" },
  { to: "/dashboard/settings", label: "Settings" },
  { to: "/dashboard/help", label: "Help" },
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
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
        >
          <span className="dashboard-menu-icon" aria-hidden>
            {sidebarOpen ? "✕" : "☰"}
          </span>
        </button>
        <button
          type="button"
          className="dashboard-signout"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </header>

      <aside className={`dashboard-sidebar ${sidebarOpen ? "dashboard-sidebar--open" : ""}`}>
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
