import axios from "axios";

/*
=====================================================
API INSTANCE
=====================================================
- Axios instance with dynamic baseURL support
- Uses REACT_APP_API_URL in production
- Default fallback: http://localhost:5000/api
*/
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

/*
=====================================================
REQUEST INTERCEPTOR
=====================================================
Purpose:
- Attach JWT token to every outgoing request automatically
- Required for protected routes (admin/staff/customer)
*/
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // Ensure headers object exists
    req.headers = req.headers || {};

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    // Request error (network, config issues)
    return Promise.reject(error);
  }
);

/*
=====================================================
RESPONSE INTERCEPTOR
=====================================================
Purpose:
- Handle 401 (unauthorized / expired token) globally
- Clean up token & role from localStorage
- Redirect to login page
*/
API.interceptors.response.use(
  (res) => res, // Pass successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      alert("Session expired or unauthorized. Please login again.");

      // Force redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
