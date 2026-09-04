import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";

export default function AuthPage({ mode }) {
  const signup = mode === "signup";
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (key) => (e) => setForm((v) => ({ ...v, [key]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (signup && form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (signup && form.password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      const endpoint = signup ? "/auth/signup" : "/auth/login";
      const result = await api.post(endpoint, form);
      if (signup) { navigate("/sign-in", { state: { message: "Account created. Please sign in." } }); return; }
      localStorage.setItem("token", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) { setError(err.response?.data?.message || "Unable to continue. Please try again."); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <p className="auth-kicker">CLINIC MANAGEMENT</p><h1>{signup ? "Create your account" : "Welcome back"}</h1><p className="page-sub">{signup ? "Set up secure access for your clinic." : "Sign in to manage your clinic."}</p>
    {signup && <label className="form-label">Full name<input className="form-input" required value={form.fullName} onChange={set("fullName")} /></label>}
    <label className="form-label">Email<input className="form-input" type="email" required value={form.email} onChange={set("email")} autoComplete="email" /></label>
    <label className="form-label">Password<input className="form-input" type="password" required minLength="8" value={form.password} onChange={set("password")} autoComplete={signup ? "new-password" : "current-password"} /></label>
    {signup && <label className="form-label">Confirm password<input className="form-input" type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" /></label>}
    {error && <div className="form-error">{error}</div>}<button className="btn-primary auth-submit" disabled={loading}>{loading ? "Please wait…" : signup ? "Create account" : "Sign in"}</button>
    <p className="auth-switch">{signup ? "Already have an account? " : "New to the clinic? "}<Link to={signup ? "/sign-in" : "/sign-up"}>{signup ? "Sign in" : "Create an account"}</Link></p>
  </form></main>;
}
