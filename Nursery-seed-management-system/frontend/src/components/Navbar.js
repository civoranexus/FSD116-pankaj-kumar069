import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // 🔐 Auth data
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // admin | staff | customer

  const [menuOpen, setMenuOpen] = useState(false);

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
        flexWrap: "wrap",
      }}
    >
      {/* ================= LEFT SIDE ================= */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontWeight: "bold", fontSize: "20px", marginRight: "20px" }}>
          Nursery Seed System
        </div>

        {/* 🍔 Hamburger button (future responsive use) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "18px",
          }}
        >
          ☰
        </button>

        <div
          style={{
            display: "flex",
            flexDirection: menuOpen ? "column" : "row",
            alignItems: menuOpen ? "flex-start" : "center",
          }}
        >
          {/* 🏠 Common Home */}
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>

          {/* ================= NOT LOGGED IN ================= */}
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

          {/* ================= LOGGED IN ================= */}
          {token && (
            <>
              {/* Dashboard sab ke liye */}
              <NavLink to="/dashboard" style={linkStyle}>
                Dashboard
              </NavLink>

              {/* ================= CUSTOMER LINKS ================= */}
              {role === "customer" && (
                <>
                  <NavLink to="/my-orders" style={linkStyle}>
                    My Orders
                  </NavLink>
                  <NavLink to="/cart" style={linkStyle}>
                    Cart
                  </NavLink>

                  {/* ❌ CUSTOMER KO YEH NAHI DIKHANA */}
                  {/*
                  <NavLink to="/inventory" style={linkStyle}>
                    Inventory
                  </NavLink>
                  <NavLink to="/orders" style={linkStyle}>
                    Orders
                  </NavLink>
                  <NavLink to="/health" style={linkStyle}>
                    Health
                  </NavLink>
                  */}
                </>
              )}

              {/* ================= ADMIN / STAFF LINKS ================= */}
              {(role === "admin" || role === "staff") && (
                <>
                  <NavLink to="/inventory" style={linkStyle}>
                    Inventory
                  </NavLink>
                  <NavLink to="/orders" style={linkStyle}>
                    Orders
                  </NavLink>
                  <NavLink to="/health" style={linkStyle}>
                    Health
                  </NavLink>
                </>
              )}

              {/* ================= ADMIN ONLY ================= */}
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

              {/* ================= STAFF ONLY ================= */}
              {role === "staff" && (
                <>
                  <NavLink to="/procurements" style={linkStyle}>
                    Procurement
                  </NavLink>
                  <NavLink to="/staff" style={linkStyle}>
                    Staff Dashboard
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      {token && (
        <div style={{ display: "flex", alignItems: "center" }}>
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
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
