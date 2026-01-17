import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ redirect after login
import API from "../api";

// ✅ Professional Login Component
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Save role (for role-based UI)
      localStorage.setItem("role", res.data.user.role);

      // ✅ Save user info (optional but useful)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Success message toast
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => setSuccessMsg(""), 3000);

      // ✅ Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/customer/home");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
      <form onSubmit={handleLogin}>
        {/* ✅ Styled Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* ✅ Styled Button with Loader */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ Error Message */}
      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}

      {/* ✅ Success Message */}
      {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}

      {/* ✅ Optional: Commented old code preserved */}
      {/*
      Original code:
      <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" ... />
          <input type="password" ... />
          <button type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>
        {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
      </div>
      */}
    </div>
  );
}

export default Login;
