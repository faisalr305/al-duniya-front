import { Route, Routes, Navigate } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientProfilePage from "./pages/PatientProfilePage";
import PatientsPage from "./pages/PatientsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

function KawaiiDecor() {
  return (
    <div className="kawaii-decor" aria-hidden="true">
      <svg className="cloud-1" viewBox="0 0 90 50" fill="currentColor">
        <path d="M20 35c-8 0-15-6-15-14s7-14 15-14c2 0 4 0 6 1 3-7 10-12 18-12 11 0 20 9 20 20 0 1 0 2-1 3 6 1 11 6 11 12 0 7-6 13-13 13H20z" />
      </svg>
      <svg className="cloud-2" viewBox="0 0 70 40" fill="currentColor">
        <path d="M15 28c-6 0-11-5-11-10s5-10 11-10c1 0 3 0 4 1 3-5 8-9 14-9 9 0 16 7 16 16 0 1 0 2-1 2 5 1 9 5 9 10 0 6-5 10-11 10H15z" />
      </svg>
      <svg className="cloud-3" viewBox="0 0 80 44" fill="currentColor">
        <path d="M18 32c-7 0-13-5-13-11s6-11 13-11c2 0 3 0 5 1 3-6 9-10 16-10 10 0 18 8 18 18 0 1 0 2-1 3 5 1 9 5 9 10 0 6-5 11-11 11H18z" />
      </svg>
      <svg className="sparkle-1" viewBox="0 0 22 22" fill="currentColor">
        <path d="M11 0l2.5 8.5L22 11l-8.5 2.5L11 22l-2.5-8.5L0 11l8.5-2.5z" />
      </svg>
      <svg className="sparkle-2" viewBox="0 0 18 18" fill="currentColor">
        <path d="M9 0l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
      </svg>
      <svg className="heart-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18s-7-4.5-9-9.5C-.5 4 3 0 7 0c2 0 3 1 3 1s1-1 3-1c4 0 7.5 4 6 8.5-2 5-9 9.5-9 9.5z" />
      </svg>
      <svg className="bow-1" viewBox="0 0 26 22" fill="currentColor">
        <path d="M13 11c0-3 2-6 5-8 2-1 5 0 5 2 0 3-3 5-6 6 3 1 6 3 6 6 0 2-3 3-5 2-3-2-5-5-5-8zm0 0c0 3-2 6-5 8-2 1-5 0-5-2 0-3 3-5 6-6-3-1-6-3-6-6 0-2 3-3 5-2 3 2 5 5 5 8z" />
        <circle cx="13" cy="11" r="2.5" />
      </svg>
    </div>
  );
}

function App() {
  return (
    <>
      <KawaiiDecor />
      {localStorage.getItem("token") && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} /><Route path="/sign-in" element={<AuthPage mode="signin" />} /><Route path="/sign-up" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
