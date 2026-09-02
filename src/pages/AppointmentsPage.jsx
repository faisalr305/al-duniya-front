import { useState, useEffect } from "react";
import {
  getAllAppointments,
  updateAppointment,
} from "../services/clinicService";
import { getAllPatients } from "../services/clinicService";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentForm from "../components/AppointmentForm";
import PaymentModal from "../components/PaymentModal";
import Sidebar from "../components/Sidebar";

const STATUSES = [
  "",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "No Show",
];
const PAY_STATUSES = ["", "Unpaid", "Partial", "Paid"];

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
    doctor: "",
  });
  const [editAppt, setEditAppt] = useState(null);
  const [payAppt, setPayAppt] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.doctor) params.doctor = filters.doctor;
      if (filters.search) params.search = filters.search;
      const data = await getAllAppointments(params);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters]);

  const setFilter = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));

  const handleStatusChange = async (id, status) => {
    const updated = await updateAppointment(id, { status });
    setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditAppt(null);
    load();
  };
  const handlePaymentAdded = (updatedAppt) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === updatedAppt._id ? updatedAppt : a)),
    );
    setPayAppt(updatedAppt);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Appointments</h1>
            <p className="page-sub">{appointments.length} appointments found</p>
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

        {/* Filters */}
        <div className="filters-bar">
          <input
            className="form-input filter-input"
            placeholder="🔍 Search patient, doctor, service…"
            value={filters.search}
            onChange={setFilter("search")}
          />
          <select
            className="form-input filter-select"
            value={filters.status}
            onChange={setFilter("status")}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All Statuses"}
              </option>
            ))}
          </select>
          <select
            className="form-input filter-select"
            value={filters.paymentStatus}
            onChange={setFilter("paymentStatus")}
          >
            {PAY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All Payments"}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="form-input filter-date"
            value={filters.startDate}
            onChange={setFilter("startDate")}
            placeholder="From"
          />
          <input
            type="date"
            className="form-input filter-date"
            value={filters.endDate}
            onChange={setFilter("endDate")}
            placeholder="To"
          />
          <button
            className="btn-ghost"
            onClick={() =>
              setFilters({
                search: "",
                status: "",
                paymentStatus: "",
                startDate: "",
                endDate: "",
                doctor: "",
              })
            }
          >
            Clear
          </button>
        </div>

        {/* Results */}
        <div className="appt-grid">
          {loading && <p className="section-empty">Loading…</p>}
          {!loading && appointments.length === 0 && (
            <p className="section-empty">No appointments found.</p>
          )}
          {!loading &&
            appointments.map((a) => (
              <AppointmentCard
                key={a._id}
                appointment={a}
                onStatusChange={handleStatusChange}
                onAddPayment={setPayAppt}
                onClick={(appt) => {
                  setEditAppt(appt);
                  setShowForm(true);
                }}
              />
            ))}
        </div>

        {showForm && (
          <AppointmentForm
            existingAppointment={editAppt}
            initialDate={new Date().toISOString().slice(0, 10)}
            onSaved={handleSaved}
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

export default AppointmentsPage;
