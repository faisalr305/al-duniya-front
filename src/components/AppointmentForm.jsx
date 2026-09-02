import { useState, useEffect } from "react";
import PatientSearch from "./PatientSearch";
import PatientHistoryPanel from "./PatientHistoryPanel";
import {
  createAppointment,
  updateAppointment,
} from "../services/clinicService";
import { to24Hour } from "../utils/format";

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled", "No Show"];

function AppointmentForm({
  initialDate,
  onSaved,
  onClose,
  existingAppointment,
}) {
  const editing = !!existingAppointment;
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    date: initialDate || "",
    time: "",
    doctor: "",
    service: "",
    status: "Pending",
    totalBill: "",
    amountPaid: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const amountDue = Math.max(
    0,
    Number(form.totalBill || 0) - Number(form.amountPaid || 0),
  );

  // Break the stored 24-hour "HH:mm" value into 12-hour picker parts.
  // e.g. "14:30" → { hour12: "2", minute: "30", period: "PM" }
  const timeParts = (() => {
    if (!form.time) return { hour12: "", minute: "", period: "" };
    const [h, m] = form.time.split(":");
    const h24 = parseInt(h, 10);
    if (Number.isNaN(h24)) return { hour12: "", minute: "", period: "" };
    return {
      hour12: String(h24 % 12 === 0 ? 12 : h24 % 12),
      minute: m ? m.slice(0, 2) : "",
      period: h24 >= 12 ? "PM" : "AM",
    };
  })();

  const setTime = (part) => (e) => {
    const next = { ...timeParts, [part]: e.target.value };
    setForm((f) => ({
      ...f,
      time: to24Hour(next.hour12, next.minute, next.period),
    }));
  };

  useEffect(() => {
    if (existingAppointment) {
      const a = existingAppointment;
      setSelectedPatient(a.patient);
      setForm({
        patientName: a.patient?.name || "",
        patientPhone: a.patient?.phone || "",
        date: a.date ? a.date.slice(0, 10) : "",
        time: a.time || "",
        doctor: a.doctor || "",
        service: a.service || "",
        status: a.status || "Pending",
        totalBill: a.totalBill || "",
        amountPaid: a.amountPaid || "",
        notes: a.notes || "",
      });
    }
  }, [existingAppointment]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.date || !form.time || !form.doctor || !form.service) {
      setError("Date, time, doctor, and service are required.");
      return;
    }
    if (!selectedPatient && (!form.patientName || !form.patientPhone)) {
      setError("Patient name and phone are required for new patients.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...(selectedPatient
          ? { patientId: selectedPatient._id }
          : { patientName: form.patientName, patientPhone: form.patientPhone }),
        date: form.date,
        time: form.time,
        doctor: form.doctor,
        service: form.service,
        status: form.status,
        totalBill: Number(form.totalBill) || 0,
        amountPaid: Number(form.amountPaid) || 0,
        notes: form.notes,
      };
      let result;
      if (editing) {
        result = await updateAppointment(existingAppointment._id, payload);
      } else {
        result = await createAppointment(payload);
      }
      onSaved(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save appointment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editing ? "Edit Appointment" : "New Appointment"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="appt-form" onSubmit={handleSubmit}>
          {/* Patient Section */}
          <div className="form-section">
            <h3 className="form-section-title">Patient</h3>
            <div className="form-group">
              <label className="form-label">Search Existing Patient</label>
              <PatientSearch
                onSelect={setSelectedPatient}
                selectedPatient={selectedPatient}
                onClear={() => setSelectedPatient(null)}
              />
            </div>
            {!selectedPatient && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    className="form-input"
                    value={form.patientName}
                    onChange={set("patientName")}
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    className="form-input"
                    value={form.patientPhone}
                    onChange={set("patientPhone")}
                    placeholder="+971 5X XXX XXXX"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Show returning patient history */}
          {selectedPatient && (
            <PatientHistoryPanel patientId={selectedPatient._id} />
          )}

          {/* Appointment Details */}
          <div className="form-section">
            <h3 className="form-section-title">Appointment Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={set("date")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <div className="time-picker">
                  <select
                    className="form-input"
                    value={timeParts.hour12}
                    onChange={setTime("hour12")}
                    aria-label="Hour"
                  >
                    <option value="">Hour</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-input"
                    value={timeParts.minute}
                    onChange={setTime("minute")}
                    aria-label="Minute"
                  >
                    <option value="">Min</option>
                    {Array.from({ length: 60 }, (_, i) => (
                      <option
                        key={i}
                        value={String(i).padStart(2, "0")}
                      >
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-input"
                    value={timeParts.period}
                    onChange={setTime("period")}
                    aria-label="AM or PM"
                  >
                    <option value="">AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Doctor *</label>
                <input
                  className="form-input"
                  value={form.doctor}
                  onChange={set("doctor")}
                  placeholder="Doctor name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service *</label>
                <input
                  className="form-input"
                  value={form.service}
                  onChange={set("service")}
                  placeholder="e.g. General Check-up"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={form.status}
                onChange={set("status")}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={2}
                value={form.notes}
                onChange={set("notes")}
                placeholder="Optional notes…"
              />
            </div>
          </div>

          {/* Billing */}
          <div className="form-section">
            <h3 className="form-section-title">Billing</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Bill (AED)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={form.totalBill}
                  onChange={set("totalBill")}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount Paid (AED)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={form.amountPaid}
                  onChange={set("amountPaid")}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount Due (AED)</label>
                <input
                  className="form-input"
                  readOnly
                  value={amountDue.toFixed(2)}
                  style={{
                    background: amountDue > 0 ? "#fef2f2" : "#f0fdf4",
                    color: amountDue > 0 ? "#dc2626" : "#16a34a",
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Saving…"
                : editing
                  ? "Update Appointment"
                  : "Create Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;
