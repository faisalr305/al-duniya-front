import { useState, useEffect } from "react";
import { getPatient } from "../services/clinicService";

function PatientHistoryPanel({ patientId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getPatient(patientId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading)
    return (
      <div className="history-panel loading">Loading patient history…</div>
    );
  if (!data) return null;

  const { appointments, totals } = data;

  return (
    <div className="history-panel">
      <h3 className="history-title">↩ Returning Patient</h3>
      <div className="history-grid">
        <div className="history-stat">
          <span className="stat-label">Total Billed</span>
          <span className="stat-value">
            {totals.totalBilled.toFixed(2)} AED
          </span>
        </div>
        <div className="history-stat">
          <span className="stat-label">Total Paid</span>
          <span className="stat-value text-green">
            {totals.totalPaid.toFixed(2)} AED
          </span>
        </div>
        <div className="history-stat">
          <span className="stat-label">Outstanding</span>
          <span className="stat-value text-red">
            {totals.totalDue.toFixed(2)} AED
          </span>
        </div>
        <div className="history-stat">
          <span className="stat-label">Visits</span>
          <span className="stat-value">{appointments.length}</span>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="history-appointments">
          <h4>Previous Appointments</h4>
          <div className="history-list">
            {appointments.slice(0, 5).map((a) => (
              <div key={a._id} className="history-item">
                <div className="history-item-left">
                  <span
                    className={`status-badge status-${a.status?.toLowerCase().replace(" ", "-")}`}
                  >
                    {a.status}
                  </span>
                  <span className="history-date">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="history-item-right">
                  <span className="history-service">
                    {a.service} — {a.doctor}
                  </span>
                  <span
                    className={`history-due${a.amountDue > 0 ? " text-red" : " text-green"}`}
                  >
                    Due: {(a.amountDue || 0).toFixed(2)} AED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHistoryPanel;
