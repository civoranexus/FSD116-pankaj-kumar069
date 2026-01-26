import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

/* =====================================================
   LOGIN PAGE – PROFESSIONAL UX/UI
   👉 Same design language as Register
   👉 Frontend polish only
===================================================== */

function Login() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= HANDLER ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      /* ================= SAVE AUTH DATA ================= */
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccessMsg("Login successful. Redirecting...");

      /* UX: short delay so success FEELS real */
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "staff") {
          navigate("/staff/dashboard");
        } else {
          navigate("/customer/home");
        }
      }, 1200);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= CARD ================= */}
      <div className="auth-card">

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Login to continue managing your nursery
        </p>

        <form onSubmit={handleLogin} className="auth-form">

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            className={`auth-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ================= FEEDBACK ================= */}
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        {successMsg && <p className="success-text">{successMsg}</p>}

        {/* ================= FOOT ================= */}
        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/register">Create one</Link>
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
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
      */}
    </div>
  );
}

export default Login;
