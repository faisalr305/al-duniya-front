import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_BACK_END_SERVER_URL ,
  withCredentials: true,
});

let refreshPromise;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const endSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/sign-in") {
    window.location.assign("/sign-in");
  }
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${import.meta.env.VITE_BACK_END_SERVER_URL}/auth/refresh`, null, {
        withCredentials: true,
      })
      .then(({ data }) => {
        localStorage.setItem("token", data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = undefined;
      });
  }
  return refreshPromise;
};

// A 401 from a protected endpoint is retried once with a silently refreshed
// access token. Multiple simultaneous failed calls share the same refresh.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.startsWith("/auth/");
    if (error.response?.status !== 401 || originalRequest?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      endSession();
      return Promise.reject(refreshError);
    }
  },
);

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    endSession();
  }
};

export default api;
