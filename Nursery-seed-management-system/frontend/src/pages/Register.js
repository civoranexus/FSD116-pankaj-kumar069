import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

/* =====================================================
   REGISTER PAGE – PROFESSIONAL UX/UI
   👉 Frontend focused
   👉 Clean structure
   👉 Interview ready
===================================================== */

function Register() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= HANDLER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
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

      setSuccessMsg("Account created successfully. Redirecting to login...");

      // UX: short delay so user FEELS success
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
    <div className="auth-page">

      {/* ================= CARD ================= */}
      <div className="auth-card">

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Start managing your nursery professionally
        </p>

        <form onSubmit={handleRegister} className="auth-form">

          {/* ================= NAME ================= */}
          <div className="input-group">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Full Name</label>
          </div>

          {/* ================= EMAIL ================= */}
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email Address</label>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="input-group">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {/* ================= ROLE ================= */}
          <div className="input-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <label>User Role</label>
          </div>

          {/* ================= BUTTON ================= */}
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

        {/* ================= FOOT ================= */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>

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
    </div>
  );
}

export default Register;
