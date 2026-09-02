import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { username, password, passwordConf } = formData;
  const passwordsMismatch = Boolean(password && passwordConf && password !== passwordConf);

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      await signUp(formData);
      navigate("/sign-in");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create account right now.");
      setSubmitting(false);
    }
  }

  function isFormInvalid() {
    return !(username && password && password === passwordConf);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🩺</span>
          <h1>Create your account</h1>
          <p>Join the clinic management system</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
              placeholder="Choose a username"
              autoComplete="off"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="off"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="off"
              className={passwordsMismatch ? "auth-input-invalid" : ""}
              required
            />
            {passwordsMismatch && (
              <span className="auth-hint">Passwords do not match.</span>
            )}
          </div>
          <button
            type="submit"
            className="auth-submit"
            disabled={isFormInvalid() || submitting}
          >
            {submitting ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
export default Signup;
