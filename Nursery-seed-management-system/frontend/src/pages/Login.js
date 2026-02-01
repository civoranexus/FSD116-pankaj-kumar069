import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

/* =====================================================
   LOGIN PAGE – ENHANCED UX/UI
===================================================== */

function Login() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= HANDLER ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // ================= SAVE AUTH DATA =================
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user._id);

      setSuccessMsg("Login successful. Redirecting...");

      // Redirect based on role
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "staff") {
          navigate("/staff/dashboard");
        } else {
          navigate("/customer/home");
        }
      }, 1000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Login page">
      <section className="auth-card" role="form">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Login to continue managing your nursery</p>

        <form onSubmit={handleLogin} className="auth-form">
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

          <div className="input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className={`auth-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMsg && <p className="error-text">{errorMsg}</p>}
        {successMsg && <p className="success-text">{successMsg}</p>}

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </section>

      {/* ❌ OLD VERSION (kept for reference)
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>
      </div>
      */}
    </main>
  );
}

export default Login;
