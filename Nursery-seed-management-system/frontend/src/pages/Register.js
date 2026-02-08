import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

/* =====================================================
   REGISTER PAGE – CUSTOMER ONLY
   ❌ Admin / Staff self-register DISABLED
   ✅ Only customer can register
===================================================== */

function Register() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔒 Role is FIXED as customer (security reason)
  const role = "customer";

  /* ❌ OLD (DO NOT USE – SECURITY ISSUE)
  const [role, setRole] = useState("customer");
  */

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= HANDLER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role, // ✅ always "customer"
      });

      setSuccessMsg(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => navigate("/login"), 1600);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Register page">
      <section className="auth-card" role="form">

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Register as a customer to place orders
        </p>

        <form onSubmit={handleRegister} className="auth-form">

          {/* ================= NAME ================= */}
          <div className="input-group">
            <input
              id="name"
              type="text"
              required
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="name">Full Name</label>
          </div>

          {/* ================= EMAIL ================= */}
          <div className="input-group">
            <input
              id="email"
              type="email"
              required
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>

            <span
              className="toggle-password"
              role="button"
              tabIndex={0}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            <small className="input-hint">
              Minimum 6 characters
            </small>
          </div>

          {/* =================================================
              ❌ ROLE SELECTION REMOVED (SECURITY FIX)
              Anyone could register as admin/staff earlier
          ================================================= */}
          {/*
          <div className="input-group">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">User Role</label>
          </div>
          */}

          {/* ================= SUBMIT ================= */}
          <button
            type="submit"
            className={`auth-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* ================= FEEDBACK ================= */}
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        {successMsg && <p className="success-text">{successMsg}</p>}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
