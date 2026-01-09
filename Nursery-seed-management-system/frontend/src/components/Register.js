import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ redirect after register
import API from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/register", { name, email, password, role });

      setSuccessMsg("User registered successfully!");
      // ✅ Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1500);
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
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
          minLength={6}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "0.75rem" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* ✅ Inline feedback */}
      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}
    </div>
  );
}

export default Register;