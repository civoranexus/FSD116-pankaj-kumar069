import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

/* =====================================================
   REGISTER PAGE – ENHANCED UX/UI
   👉 Same design language as Login
   👉 Accessible, scalable, interview-ready
===================================================== */

function Register() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [showPassword, setShowPassword] = useState(false); // ✅ UX IMPROVEMENT

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= HANDLER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ Prevent double submit

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccessMsg(
        "Account created successfully. Redirecting to login..."
      );

      // UX: short delay so success feels real
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

      {/* ================= AUTH CARD ================= */}
      <section className="auth-card" role="form">

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Start managing your nursery professionally
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
              aria-label="Full name"
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
              aria-label="Email address"
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"} // ✅ SHOW/HIDE
              required
              minLength={6}
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <label htmlFor="password">Password</label>

            {/* ✅ UX FEATURE */}
            <span
              className="toggle-password"
              role="button"
              tabIndex={0}
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            {/* ✅ Light UX Hint */}
            <small className="input-hint">
              Minimum 6 characters
            </small>
          </div>

          {/* ================= ROLE ================= */}
          <div className="input-group">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="User role"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">User Role</label>
          </div>

          {/* ================= SUBMIT ================= */}
          <button
            type="submit"
            className={`auth-btn ${loading ? "loading" : ""}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* ================= FEEDBACK ================= */}
        {errorMsg && (
          <p className="error-text" role="alert">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="success-text" role="status">
            {successMsg}
          </p>
        )}

        {/* ================= FOOT ================= */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </section>

      {/* =====================================================
          ❌ OLD VERSION (DO NOT DELETE – FOR LEARNING)
      ===================================================== */}
      {/*
      <div
        style={{
          maxWidth: "400px",
          margin: "2rem auto",
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <select>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
      */}
    </main>
  );
}

export default Register;
