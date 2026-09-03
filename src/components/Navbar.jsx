import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon navbar-hello-kitty" aria-label="Hello Kitty mascot">
            <svg viewBox="0 0 64 64" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="32" cy="36" rx="20" ry="18" fill="#FFFFFF" stroke="#403842" strokeWidth="1.2"/>
              <polygon points="14,18 22,12 18,24" fill="#FFFFFF" stroke="#403842" strokeWidth="1.2" strokeLinejoin="round"/>
              <polygon points="50,18 42,12 46,24" fill="#FFFFFF" stroke="#403842" strokeWidth="1.2" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="4" fill="#F4B8D0" stroke="#403842" strokeWidth="1"/>
              <circle cx="54" cy="20" r="4" fill="#F4B8D0" stroke="#403842" strokeWidth="1"/>
              <ellipse cx="24" cy="34" rx="2.2" ry="2.6" fill="#403842"/>
              <ellipse cx="40" cy="34" rx="2.2" ry="2.6" fill="#403842"/>
              <circle cx="24.5" cy="33.5" r="0.7" fill="#FFFFFF"/>
              <circle cx="40.5" cy="33.5" r="0.7" fill="#FFFFFF"/>
              <path d="M29 40 Q32 43 35 40" stroke="#403842" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <path d="M32 38 L32 40" stroke="#403842" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="navbar-brand-text">Clinic</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/appointments" className="navbar-link">Appointments</Link>
          <Link to="/patients" className="navbar-link">Patients</Link>
        </nav>

        <button
          type="button"
          className="navbar-theme-toggle"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user && (
          <div className="navbar-account">
            <span className="navbar-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <span className="navbar-username">{user?.username}</span>
            <button type="button" className="navbar-logout" onClick={logout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar