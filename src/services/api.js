import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_BACK_END_SERVER_URL ,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A token can expire while the app is open (the API currently issues
// one-hour tokens). Keeping it in localStorage would otherwise make every
// protected request fail while ProtectedRoute still considers the user signed
// in. Clear the stale session and return to the sign-in page as soon as the
// API tells us it is no longer valid.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/sign-in") {
        window.location.assign("/sign-in");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
