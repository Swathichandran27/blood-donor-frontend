import axios from "axios";
import authService from "./AuthService";// your service that handles token storage

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // your backend base URL
});

// Add request interceptor to attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken(); // get token from localStorage/sessionStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor to handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Clear token and redirect if needed
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
