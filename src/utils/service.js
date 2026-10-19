import Axios from "axios";
import { clearAuth, getSecureToken } from "./cookieAuth";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "https://book-store-backend-czfy.onrender.com";

const instance = Axios.create({
  baseURL: import.meta.env.DEV ? undefined : apiBaseURL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token fresh on every request
instance.interceptors.request.use(
  (request) => {
    const token = getSecureToken();
    if (token) request.headers["Authorization"] = `Bearer ${token}`;
    return request;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle unauthorized responses
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuth();
        // window.location.href = `/${import.meta.env.VITE_APP_URL}/login`;
    }
    return Promise.reject(error);
  }
);

export default instance;