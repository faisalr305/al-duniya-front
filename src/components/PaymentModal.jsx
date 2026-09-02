import { useState } from "react";
import {
  addPayment,
  getPaymentsByAppointment,
} from "../services/clinicService";
import { useEffect } from "react";

const METHODS = ["Cash", "Card", "Insurance", "Transfer", "Other"];

function PaymentModal({ appointment, onClose, onPaymentAdded }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (appointment?._id) {
      getPaymentsByAppointment(appointment._id)
        .then(setPayments)
        .catch(() => {});
    }
  }, [appointment?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (Number(amount) > appointment.amountDue) {
      setError(
        `Amount cannot exceed the due amount (${appointment.amountDue.toFixed(2)} AED).`,
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await addPayment({
        appointmentId: appointment._id,
        amount: Number(amount),
        method,
        notes,
      });
      setPayments((prev) => [result.payment, ...prev]);
      onPaymentAdded(result.appointment);
      setAmount("");
      setNotes("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add payment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Payment</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="payment-summary">
          <div className="pay-stat">
            <span>Total Bill</span>
            <strong>{(appointment.totalBill || 0).toFixed(2)} AED</strong>
          </div>
          <div className="pay-stat">
            <span>Paid</span>
            <strong className="text-green">
              {(appointment.amountPaid || 0).toFixed(2)} AED
            </strong>
          </div>
          <div className="pay-stat">
            <span>Due</span>
            <strong className="text-red">
              {(appointment.amountDue || 0).toFixed(2)} AED
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (AED) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={appointment.amountDue}
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Method</label>
              <select
                className="form-input"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional note…"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={saving}
          >
            {saving ? "Saving…" : "Record Payment"}
          </button>
        </form>

        {payments.length > 0 && (
          <div className="payment-history">
            <h4>Payment History</h4>
            {payments.map((p) => (
              <div key={p._id} className="payment-row">
                <span>
                  {new Date(p.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span>{p.method}</span>
                <strong className="text-green">
                  +{(p.amount || 0).toFixed(2)} AED
                </strong>
                {p.notes && <span className="text-muted">— {p.notes}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
