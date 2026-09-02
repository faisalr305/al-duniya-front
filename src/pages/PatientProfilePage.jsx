import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getPatient } from "../services/clinicService";
import AppointmentCard from "../components/AppointmentCard";
import PaymentModal from "../components/PaymentModal";
import AppointmentForm from "../components/AppointmentForm";
import Sidebar from "../components/Sidebar";
import { formatTime12h } from "../utils/format";

function PatientProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payAppt, setPayAppt] = useState(null);
  const [editAppt, setEditAppt] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setData(await getPatient(id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handlePaymentAdded = (updatedAppt) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) =>
        a._id === updatedAppt._id ? updatedAppt : a,
      ),
    }));
    setPayAppt(updatedAppt);
    load();
  };

  if (loading)
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p className="section-empty">Loading…</p>
        </main>
      </div>
    );
  if (!data)
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p className="section-empty">Patient not found.</p>
        </main>
      </div>
    );

  const {
    patient,
    appointments,
    payments,
    totals,
    latestAppointment,
    upcomingAppointment,
  } = data;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <Link to="/patients" className="back-link">
              ← All Patients
            </Link>
            <h1 className="page-title">{patient.name}</h1>
            <p className="page-sub">
              {patient.phone}
              {patient.email ? ` · ${patient.email}` : ""}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditAppt(null);
              setShowForm(true);
            }}
          >
            + New Appointment
          </button>
        </div>

        {/* Patient Info */}
        <div className="patient-info-card">
          <div className="patient-info-row">
            {patient.gender && (
              <span>
                <strong>Gender:</strong> {patient.gender}
              </span>
            )}
            {patient.dateOfBirth && (
              <span>
                <strong>DOB:</strong>{" "}
                {new Date(patient.dateOfBirth).toLocaleDateString("en-GB")}
              </span>
            )}
            {patient.address && (
              <span>
                <strong>Address:</strong> {patient.address}
              </span>
            )}
            {patient.notes && (
              <span>
                <strong>Notes:</strong> {patient.notes}
              </span>
            )}
          </div>
          {latestAppointment && (
            <p className="patient-info-row">
              <strong>Last Visit:</strong>{" "}
              {new Date(latestAppointment.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              at {formatTime12h(latestAppointment.time)} — {latestAppointment.service}
            </p>
          )}
          {upcomingAppointment && (
            <p className="patient-info-row text-blue">
              <strong>Next Appointment:</strong>{" "}
              {new Date(upcomingAppointment.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              at {formatTime12h(upcomingAppointment.time)} — {upcomingAppointment.service}
            </p>
          )}
        </div>

        {/* Billing Summary */}
        <div className="stats-row">
          <div className="stat-card stat-card-blue">
            <p className="stat-label">Total Billed</p>
            <p className="stat-value">
              {(totals.totalBilled || 0).toFixed(2)} AED
            </p>
          </div>
          <div className="stat-card stat-card-green">
            <p className="stat-label">Total Paid</p>
            <p className="stat-value">
              {(totals.totalPaid || 0).toFixed(2)} AED
            </p>
          </div>
          <div className="stat-card stat-card-red">
            <p className="stat-label">Outstanding</p>
            <p className="stat-value">
              {(totals.totalDue || 0).toFixed(2)} AED
            </p>
          </div>
          <div className="stat-card stat-card-purple">
            <p className="stat-label">Visits</p>
            <p className="stat-value">{appointments.length}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="section-header">
          <h2 className="section-title">Appointment History</h2>
        </div>
        <div className="appt-grid">
          {appointments.length === 0 && (
            <p className="section-empty">No appointments yet.</p>
          )}
          {appointments.map((a) => (
            <AppointmentCard
              key={a._id}
              appointment={a}
              onAddPayment={setPayAppt}
              onClick={(appt) => {
                setEditAppt(appt);
                setShowForm(true);
              }}
            />
          ))}
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <>
            <div className="section-header mt">
              <h2 className="section-title">Payment History</h2>
            </div>
            <div className="payment-table">
              <div className="payment-table-header">
                <span>Date</span>
                <span>Method</span>
                <span>Amount</span>
                <span>Notes</span>
              </div>
              {payments.map((p) => (
                <div key={p._id} className="payment-table-row">
                  <span>
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>{p.method}</span>
                  <span className="text-green">
                    +{(p.amount || 0).toFixed(2)} AED
                  </span>
                  <span className="text-muted">{p.notes || "—"}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {showForm && (
          <AppointmentForm
            existingAppointment={editAppt}
            initialDate={new Date().toISOString().slice(0, 10)}
            onSaved={() => {
              setShowForm(false);
              setEditAppt(null);
              load();
            }}
            onClose={() => {
              setShowForm(false);
              setEditAppt(null);
            }}
          />
        )}
        {payAppt && (
          <PaymentModal
            appointment={payAppt}
            onClose={() => setPayAppt(null)}
            onPaymentAdded={handlePaymentAdded}
          />
        )}
      </main>
    </div>
  );
}

export default PatientProfilePage;
