import { useState, useEffect } from "react";
import { Link } from "react-router";
import { deletePatient, getAllPatients } from "../services/clinicService";
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

  const handleDelete = async (patient) => {
    if (
      !window.confirm(
        `Delete patient "${patient.name}"? Their appointments and payment history will be kept.`,
      )
    )
      return;
    try {
      await deletePatient(patient._id);
      setPatients((prev) => prev.filter((p) => p._id !== patient._id));
    } catch (err) {
      console.error(err);
      alert("Could not delete patient. " + (err.response?.data?.message || err.message));
    }
  };

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
            <div className="patient-card-wrap" key={p._id}>
              <Link
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
              <button
                type="button"
                className="patient-card-delete"
                title={`Delete ${p.name}`}
                aria-label={`Delete ${p.name}`}
                onClick={() => handleDelete(p)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PatientsPage;
