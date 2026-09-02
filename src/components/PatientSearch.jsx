import { useState, useEffect, useRef } from "react";
import { searchPatients, getPatient } from "../services/clinicService";

function PatientSearch({ onSelect, selectedPatient, onClear }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        setResults(await searchPatients(query));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  if (selectedPatient) {
    return (
      <div className="patient-selected">
        <div className="patient-selected-info">
          <span className="patient-tag">👤</span>
          <strong>{selectedPatient.name}</strong>
          <span className="text-muted">{selectedPatient.phone}</span>
        </div>
        <button type="button" className="btn-ghost-sm" onClick={onClear}>
          ✕ Change
        </button>
      </div>
    );
  }

  return (
    <div className="patient-search" ref={ref}>
      <input
        type="text"
        className="form-input"
        placeholder="Search by name or phone..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
      />
      {open && query.length >= 2 && (
        <div className="search-dropdown">
          {loading && <div className="search-loading">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="search-empty">
              <p>No existing patient found.</p>
              <small>
                A new patient will be created with the details you provide
                below.
              </small>
            </div>
          )}
          {results.map((p) => (
            <button
              key={p._id}
              type="button"
              className="search-result"
              onClick={() => {
                onSelect(p);
                setOpen(false);
                setQuery("");
              }}
            >
              <span className="result-name">{p.name}</span>
              <span className="result-phone">{p.phone}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientSearch;
