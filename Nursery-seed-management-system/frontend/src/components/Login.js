import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ redirect after login
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "0.75rem" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ Inline error message */}
      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
    </div>
  );
}

export default Login;