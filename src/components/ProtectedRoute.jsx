import { Navigate } from "react-router";
export default function ProtectedRoute({ children }) { return localStorage.getItem("token") ? children : <Navigate to="/sign-in" replace />; }
