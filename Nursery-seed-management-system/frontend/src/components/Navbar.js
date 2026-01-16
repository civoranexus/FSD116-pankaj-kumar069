import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [menuOpen, setMenuOpen] = useState(false); // Added for responsive mobile menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    margin: "0 10px",
    color: "white",
    textDecoration: isActive ? "underline" : "none",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#2c3e50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // Added for responsive
      }}
    >
      {/* Left side links */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontWeight: "bold", fontSize: "20px", marginRight: "20px" }}>
          Nursery Seed System
        </div>

        {/* Hamburger menu for small screens */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", // Hide on desktop
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "18px",
          }}
          className="hamburger-button"
        >
          ☰
        </button>

        <div
          style={{
            display: menuOpen ? "flex" : "flex",
            flexDirection: menuOpen ? "column" : "row",
            alignItems: menuOpen ? "flex-start" : "center",
          }}
        >
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>

          {!token && (
            <>
              <NavLink to="/login" style={linkStyle}>
                Login
              </NavLink>
              <NavLink to="/register" style={linkStyle}>
                Register
              </NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/dashboard" style={linkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/inventory" style={linkStyle}>
                Inventory
              </NavLink>
              <NavLink to="/orders" style={linkStyle}>
                Orders
              </NavLink>

              {/* Role-based links */}
              {role === "admin" && (
                <>
                  <NavLink to="/suppliers" style={linkStyle}>
                    Suppliers
                  </NavLink>
                  <NavLink to="/admin" style={linkStyle}>
                    Admin
                  </NavLink>
                  <NavLink to="/sales-report" style={linkStyle}>
                    Sales Report
                  </NavLink>
                </>
              )}
              {role === "staff" && (
                <NavLink to="/procurements" style={linkStyle}>
                  Procurement
                </NavLink>
              )}

              <NavLink to="/health" style={linkStyle}>
                Health
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Right side: Greeting + Logout */}
      {token && (
        <div style={{ display: "flex", alignItems: "center", marginTop: menuOpen ? "10px" : "0" }}>
          <span style={{ marginRight: "15px" }}>
            {role === "admin" && "👑 Admin Panel"}
            {role === "staff" && "👷 Staff Portal"}
            {role === "customer" && "🛒 Customer Area"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#34495e")}
            onMouseOut={(e) => (e.target.style.background = "transparent")}
          >
            Logout
          </button>
        </div>
      )}

      {/* Optional: Commented old code preserved */}
      {/*
      Old code:
      <nav
        style={{
          padding: "10px 20px",
          background: "#2c3e50",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        ...
      </nav>
      */}
    </nav>
  );
}

export default Navbar;
