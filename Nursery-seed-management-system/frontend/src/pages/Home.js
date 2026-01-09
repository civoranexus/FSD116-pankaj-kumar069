import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "#2c3e50" }}>🌱 Nursery & Seed Management System</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Manage inventory, suppliers, procurement, orders, and plant health — all in one place.
      </p>

      {/* Call-to-action buttons */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          to="/login"
          style={{
            margin: "10px",
            padding: "10px 20px",
            background: "#27ae60",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            margin: "10px",
            padding: "10px 20px",
            background: "#2980b9",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Register
        </Link>
      </div>

      {/* Features section */}
      <div style={{ marginTop: "3rem", textAlign: "left", maxWidth: "600px", margin: "3rem auto" }}>
        <h2>✨ Features</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li>📦 Track seed, sapling, and plant inventory</li>
          <li>🤝 Manage suppliers and procurement</li>
          <li>🛒 Place and monitor customer orders</li>
          <li>📊 View sales reports and analytics</li>
          <li>🌿 Monitor plant health and treatments</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;