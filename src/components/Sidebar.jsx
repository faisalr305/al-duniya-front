import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/appointments", icon: "📅", label: "Appointments" },
  { to: "/patients", icon: "🩷", label: "Patients" },
];

function Sidebar() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      )}
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🩺</span>
          <span className="sidebar-logo-text">Clinic</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${pathname === to ? " active" : ""}`}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div className="sidebar-user">
            <span className="sidebar-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </span>
            <span className="sidebar-username">{user?.username}</span>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Sign Out">
            ↩
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
