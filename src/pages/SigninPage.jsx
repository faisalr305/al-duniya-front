import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { signIn } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const SignInForm = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate("/dashboard");
    } catch (err) {
      console.log(`Error: ${err}`);
      setError(
        err?.response?.data?.message || "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const formInvalid = !formData.username || !formData.password;

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🩺</span>
          <h1>Welcome back</h1>
          <p>Sign in to your clinic account</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="auth-submit"
            disabled={formInvalid || submitting}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-alt">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up">Create one</Link>
        </p>
      </div>
    </main>
  );
};

export default SignInForm;

