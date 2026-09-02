import { formatTime12h } from "../utils/format";

const STATUS_COLORS = {
  Pending: "status-pending",
  Confirmed: "status-confirmed",
  Completed: "status-completed",
  Cancelled: "status-cancelled",
  "No Show": "status-noshow",
};

const PAYMENT_COLORS = {
  Paid: "pay-paid",
  Partial: "pay-partial",
  Unpaid: "pay-unpaid",
};

function AppointmentCard({
  appointment,
  onClick,
  onStatusChange,
  onAddPayment,
}) {
  const {
    patient,
    date,
    time,
    doctor,
    service,
    status,
    totalBill,
    amountPaid,
    amountDue,
    paymentStatus,
    notes,
  } = appointment;

  return (
    <div className="appt-card" onClick={() => onClick?.(appointment)}>
      <div className="appt-card-header">
        <div className="appt-card-patient">
          <span className="appt-avatar">
            {patient?.name?.[0]?.toUpperCase()}
          </span>
          <div>
            <p className="appt-name">{patient?.name}</p>
            <p className="appt-phone">{patient?.phone}</p>
          </div>
        </div>
        <div className="appt-card-meta">
          <span className={`status-badge ${STATUS_COLORS[status] || ""}`}>
            {status}
          </span>
          <span className={`pay-badge ${PAYMENT_COLORS[paymentStatus] || ""}`}>
            {paymentStatus}
          </span>
        </div>
      </div>

      <div className="appt-card-body">
        <div className="appt-row">
          <span className="appt-label">🕐</span>
          <span>{formatTime12h(time)}</span>
          <span className="appt-label ml">📅</span>
          <span>
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="appt-row">
          <span className="appt-label">👨‍⚕️</span>
          <span>{doctor}</span>
          <span className="appt-label ml">💊</span>
          <span>{service}</span>
        </div>
        <div className="appt-billing">
          <span>
            Bill: <strong>{(totalBill || 0).toFixed(2)} AED</strong>
          </span>
          <span>
            Paid:{" "}
            <strong className="text-green">
              {(amountPaid || 0).toFixed(2)} AED
            </strong>
          </span>
          <span>
            Due:{" "}
            <strong className={amountDue > 0 ? "text-red" : "text-green"}>
              {(amountDue || 0).toFixed(2)} AED
            </strong>
          </span>
        </div>
        {notes && <p className="appt-notes">📝 {notes}</p>}
      </div>

      {(onStatusChange || onAddPayment) && (
        <div className="appt-card-actions" onClick={(e) => e.stopPropagation()}>
          {onStatusChange && (
            <select
              className="status-select"
              value={status}
              onChange={(e) => onStatusChange(appointment._id, e.target.value)}
            >
              {[
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled",
                "No Show",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          {onAddPayment && amountDue > 0 && (
            <button
              className="btn-primary-sm"
              onClick={() => onAddPayment(appointment)}
            >
              + Add Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
