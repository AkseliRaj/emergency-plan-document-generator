import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./config/firebaseConfig";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import CreateNewDocument from "./pages/CreateNewDocument";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>
        <p style={{ color: "#a3a3a3" }}>Loading…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <SignIn />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
      <Route path="/dashboard/plans" element={user ? <DashboardLayout><CreateNewDocument /></DashboardLayout> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
