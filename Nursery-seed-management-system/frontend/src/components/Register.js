import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ redirect after register
import API from "../api";

// ✅ Professional Register Component
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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Register</h2>
      <form onSubmit={handleRegister}>
        {/* ✅ Styled Inputs */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          minLength={6}
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {/* ✅ Styled Button with loader */}
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
          {loading ? "Registering..." : "Register"}
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
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" ... />
          <input type="email" ... />
          <input type="password" ... />
          <select ... />
          <button type="submit">{loading ? "Registering..." : "Register"}</button>
        </form>
        {errorMsg && <p style={{ color: "red", marginTop: "1rem">{errorMsg}</p>}
        {successMsg && <p style={{ color: "green", marginTop: "1rem">{successMsg}</p>}
      </div>
      */}
    </div>
  );
}

export default Register;
