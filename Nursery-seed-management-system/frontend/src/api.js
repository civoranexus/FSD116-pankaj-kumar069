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
  withCredentials: false, // ✅ explicit (future-proof)
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

    // ❌ OLD (implicit headers)
    // req.headers = req.headers || {};

    // ✅ NEW (safe)
    if (!req.headers) {
      req.headers = {};
    }

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
=====================================================
RESPONSE INTERCEPTOR
=====================================================
Purpose:
- Handle auth errors globally
- Avoid breaking checkout / async flows
*/
API.interceptors.response.use(
  (response) => response,

  (error) => {
    /* ❌ OLD (unsafe – can crash when response undefined)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("Session expired or unauthorized. Please login again.");
      window.location.href = "/login";
    }
    */

    /* ✅ NEW SAFE HANDLING */
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // ❌ alert UX breaks checkout
      // alert("Session expired or unauthorized. Please login again.");

      // ✅ silent redirect
      window.location.replace("/login");
    }

    // ✅ Always reject properly so frontend can show message
    return Promise.reject(error);
  }
);

export default API;
