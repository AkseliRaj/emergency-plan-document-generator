import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import "./SignIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.code === "auth/invalid-credential" || err.code === "auth/invalid-email"
        ? "Väärä sähköposti tai salasana."
        : err.message || "Kirjautuminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1 className="signin-title">Kirjaudu sisään</h1>
        <form onSubmit={handleSubmit} className="signin-form">
          <label htmlFor="email">Sähköposti</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esim. nimi@yritys.fi"
            autoComplete="email"
            required
            disabled={loading}
          />
          <label htmlFor="password">Salasana</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={loading}
          />
          {error && <p className="signin-error">{error}</p>}
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Kirjaudutaan…" : "Kirjaudu sisään"}
          </button>
        </form>
      </div>
    </div>
  );
}
