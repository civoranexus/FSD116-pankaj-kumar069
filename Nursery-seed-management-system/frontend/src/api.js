import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // ✅ dynamic base URL
});

// ===============================
// Request interceptor: attach token if available
// ===============================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // ✅ If token exists, attach it to Authorization header
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response interceptor: handle errors globally
// ===============================
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // If unauthorized, remove token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // ⚠️ This is a temporary redirect method.
      // You can replace this with React Router navigate if you want.
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
