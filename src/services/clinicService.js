import api from "./api";

// ── Patients ──────────────────────────────────────────────────
export const searchPatients = (q) =>
  api
    .get(`/api/patients/search?q=${encodeURIComponent(q)}`)
    .then((r) => r.data);
export const getPatient = (id) =>
  api.get(`/api/patients/${id}`).then((r) => r.data);
export const getAllPatients = () =>
  api.get("/api/patients").then((r) => r.data);
export const createPatient = (data) =>
  api.post("/api/patients", data).then((r) => r.data);
export const updatePatient = (id, data) =>
  api.put(`/api/patients/${id}`, data).then((r) => r.data);
export const deletePatient = (id) =>
  api.delete(`/api/patients/${id}`).then((r) => r.data);

// ── Appointments ──────────────────────────────────────────────
export const getDashboard = () =>
  api.get("/api/appointments/dashboard").then((r) => r.data);
export const getAppointmentsByDate = (date) =>
  api.get(`/api/appointments/date/${date}`).then((r) => r.data);
export const getAppointmentsByRange = (start, end) =>
  api
    .get(`/api/appointments/range?start=${start}&end=${end}`)
    .then((r) => r.data);
export const getAllAppointments = (params = {}) =>
  api.get("/api/appointments", { params }).then((r) => r.data);
export const getAppointment = (id) =>
  api.get(`/api/appointments/${id}`).then((r) => r.data);
export const createAppointment = (data) =>
  api.post("/api/appointments", data).then((r) => r.data);
export const updateAppointment = (id, data) =>
  api.put(`/api/appointments/${id}`, data).then((r) => r.data);
export const archiveAppointment = (id) =>
  api.delete(`/api/appointments/${id}`).then((r) => r.data);

// ── Payments ──────────────────────────────────────────────────
export const addPayment = (data) =>
  api.post("/api/payments", data).then((r) => r.data);
export const getPaymentsByAppointment = (appointmentId) =>
  api.get(`/api/payments/appointment/${appointmentId}`).then((r) => r.data);
export const getPaymentsByPatient = (patientId) =>
  api.get(`/api/payments/patient/${patientId}`).then((r) => r.data);
