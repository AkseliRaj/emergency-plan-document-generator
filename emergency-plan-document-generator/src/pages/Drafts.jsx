import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { listDrafts, deleteDraft } from "../services/draftService";
import "./Drafts.css";

function formatDate(iso) {
  if (!iso) return "–";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "–";
  }
}

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    listDrafts(user.uid)
      .then(setDrafts)
      .catch((err) => {
        console.error(err);
        setError("Luonnosten lataus epäonnistui.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (draftId) => {
    if (!user || !window.confirm("Haluatko varmasti poistaa tämän luonnoksen?")) return;
    setDeletingId(draftId);
    try {
      await deleteDraft(draftId, user.uid);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (err) {
      console.error(err);
      setError("Luonnoksen poisto epäonnistui.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="drafts-page">
        <h1 className="drafts-title">Luonnosten hallinta</h1>
        <p className="drafts-loading">Ladataan luonnoksia…</p>
      </div>
    );
  }

  return (
    <div className="drafts-page">
      <h1 className="drafts-title">Luonnosten hallinta</h1>
      <p className="drafts-intro">
        Täällä voit tarkastella, muokata ja poistaa pelastussuunnitelman luonnoksia.
      </p>

      {error && (
        <p className="drafts-error" role="alert">
          {error}
        </p>
      )}

      {drafts.length === 0 ? (
        <div className="drafts-empty">
          <p>Ei tallennettuja luonnoksia.</p>
          <Link to="/dashboard/plans" className="drafts-empty-link">
            Luo uusi pelastussuunnitelma
          </Link>
        </div>
      ) : (
        <ul className="drafts-list">
          {drafts.map((draft) => (
            <li key={draft.id} className="drafts-card">
              <div className="drafts-card-main">
                <h2 className="drafts-card-title">
                  {draft.companyName || "Nimetön luonnos"}
                </h2>
                <p className="drafts-card-address">
                  {draft.address || "–"}
                </p>
                <p className="drafts-card-meta">
                  Päivitetty: {formatDate(draft.updatedAt)}
                </p>
              </div>
              <div className="drafts-card-actions">
                <Link
                  to={`/dashboard/plans?draftId=${draft.id}`}
                  className="drafts-btn drafts-btn-edit"
                >
                  Muokkaa
                </Link>
                <button
                  type="button"
                  className="drafts-btn drafts-btn-delete"
                  onClick={() => handleDelete(draft.id)}
                  disabled={deletingId === draft.id}
                  aria-label={`Poista luonnos ${draft.companyName || draft.id}`}
                >
                  {deletingId === draft.id ? "Poistetaan…" : "Poista"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
