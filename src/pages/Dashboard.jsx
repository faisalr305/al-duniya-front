import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getAppointmentsByDate, updateAppointment } from '../services/clinicService';
import { format } from 'date-fns';
import ClinicCalendar from '../components/ClinicCalendar';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentForm from '../components/AppointmentForm';
import PaymentModal from '../components/PaymentModal';
import Sidebar from '../components/Sidebar';

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

function Section({ appointments, onStatus, onPayment, onEdit, emptyMsg }) {
  if (!appointments?.length) return (
    <div className="section-empty">{emptyMsg || 'No appointments.'}</div>
  );
  return (
    <div className="appt-list">
      {appointments.map(a => (
        <AppointmentCard
          key={a._id}
          appointment={a}
          onStatusChange={(id, status) => onStatus(id, status)}
          onAddPayment={onPayment}
          onClick={onEdit}
        />
      ))}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editAppt, setEditAppt] = useState(null);
  const [payAppt, setPayAppt] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const handleDateSelect = async (dateStr) => {
    setSelectedDate(dateStr);
    try {
      const data = await getAppointmentsByDate(dateStr);
      setDayAppointments(data);
    } catch {
      setDayAppointments([]);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateAppointment(id, { status });
      setDayAppointments(prev => prev.map(a => a._id === id ? updated : a));
      loadDashboard();
    } catch (err) { console.error(err); }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditAppt(null);
    if (selectedDate) handleDateSelect(selectedDate);
    loadDashboard();
  };

  const handlePaymentAdded = (updatedAppt) => {
    setDayAppointments(prev => prev.map(a => a._id === updatedAppt._id ? updatedAppt : a));
    setPayAppt(updatedAppt);
    loadDashboard();
  };

  const tabs = [
    { id: 'today', label: `Today (${dashboard?.todays?.length || 0})` },
    { id: 'tomorrow', label: `Tomorrow (${dashboard?.tomorrows?.length || 0})` },
    { id: 'upcoming', label: `Upcoming (${dashboard?.upcoming?.length || 0})` },
    { id: 'recent', label: 'Recent' },
  ];

  const tabData = {
    today: dashboard?.todays,
    tomorrow: dashboard?.tomorrows,
    upcoming: dashboard?.upcoming,
    recent: dashboard?.recent,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Welcome back, {user?.username}</p>
          </div>
          <button className="btn-primary" onClick={() => { setEditAppt(null); setShowForm(true); }}>
            + New Appointment
          </button>
        </div>

        {/* Stats */}
        {dashboard?.stats && (
          <div className="stats-row">
            <StatCard label="Total Billed" value={`${(dashboard.stats.totalBilled || 0).toFixed(2)} AED`} color="blue" />
            <StatCard label="Total Paid" value={`${(dashboard.stats.totalPaid || 0).toFixed(2)} AED`} color="green" />
            <StatCard label="Outstanding" value={`${(dashboard.stats.totalDue || 0).toFixed(2)} AED`} color="red" />
            <StatCard label="Payments Today" value={`${(dashboard.stats.paymentsToday || 0).toFixed(2)} AED`} color="purple" />
            <StatCard label="Due Today" value={`${(dashboard.stats.todaysDue || 0).toFixed(2)} AED`} color="orange" />
            <StatCard label="Today" value={dashboard.todays?.length || 0} sub="appointments" color="teal" />
          </div>
        )}

        <div className="dashboard-body">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="section-header">
              <h2 className="section-title">📅 Calendar</h2>
            </div>
            <ClinicCalendar onDateSelect={handleDateSelect} />

            {/* Day View */}
            {selectedDate && (
              <div className="day-panel">
                <div className="day-panel-header">
                  <h3>{format(new Date(selectedDate + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}</h3>
                  <button
                    className="btn-primary-sm"
                    onClick={() => { setEditAppt(null); setShowForm(true); }}
                  >
                    + Create Appointment
                  </button>
                </div>
                {dayAppointments.length === 0
                  ? <p className="section-empty">No appointments for this day.</p>
                  : dayAppointments.map(a => (
                    <AppointmentCard
                      key={a._id}
                      appointment={a}
                      onStatusChange={handleStatusChange}
                      onAddPayment={setPayAppt}
                      onClick={appt => { setEditAppt(appt); setShowForm(true); }}
                    />
                  ))
                }
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="side-panel">
            <div className="tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {loading
                ? <p className="section-empty">Loading…</p>
                : <Section
                    appointments={tabData[activeTab]}
                    onStatus={handleStatusChange}
                    onPayment={setPayAppt}
                    onEdit={appt => { setEditAppt(appt); setShowForm(true); }}
                    emptyMsg="No appointments in this section."
                  />
              }
            </div>
          </div>
        </div>

        {showForm && (
          <AppointmentForm
            initialDate={selectedDate || format(new Date(), 'yyyy-MM-dd')}
            existingAppointment={editAppt}
            onSaved={handleSaved}
            onClose={() => { setShowForm(false); setEditAppt(null); }}
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

export default Dashboard;