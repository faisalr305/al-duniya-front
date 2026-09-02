import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getAllPatients } from "../services/clinicService";
import Sidebar from "../components/Sidebar";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPatients()
      .then(setPatients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Patients</h1>
            <p className="page-sub">{patients.length} patients registered</p>
          </div>
        </div>

        <div className="filters-bar">
          <input
            className="form-input filter-input"
            placeholder="🔍 Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="section-empty">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="section-empty">No patients found.</p>
        )}

        <div className="patients-grid">
          {filtered.map((p) => (
            <Link
              key={p._id}
              to={`/patients/${p._id}`}
              className="patient-card"
            >
              <div className="patient-card-avatar">
                {p.name[0].toUpperCase()}
              </div>
              <div className="patient-card-info">
                <p className="patient-card-name">{p.name}</p>
                <p className="patient-card-phone">{p.phone}</p>
                {p.email && <p className="patient-card-email">{p.email}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PatientsPage;
