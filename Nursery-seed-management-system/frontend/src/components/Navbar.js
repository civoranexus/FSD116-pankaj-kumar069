import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* ================= LEFT SIDE ================= */}
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-dot" />
          Nursery Seed System
        </div>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            Home
          </NavLink>

          {!token && (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>

              {role === "customer" && (
                <>
                  <NavLink to="/my-orders" className="nav-link" onClick={closeMenu}>
                    My Orders
                  </NavLink>
                  <NavLink to="/cart" className="nav-link" onClick={closeMenu}>
                    Cart
                  </NavLink>
                  <NavLink to="/place-order" className="nav-link" onClick={closeMenu}>
                    Place Order
                  </NavLink>
                </>
              )}

              {(role === "admin" || role === "staff") && (
                <>
                  <NavLink to="/inventory" className="nav-link" onClick={closeMenu}>
                    Inventory
                  </NavLink>
                  <NavLink to="/orders" className="nav-link" onClick={closeMenu}>
                    Orders
                  </NavLink>
                  <NavLink to="/health" className="nav-link" onClick={closeMenu}>
                    Health
                  </NavLink>
                </>
              )}

              {role === "admin" && (
                <>
                  <NavLink to="/suppliers" className="nav-link" onClick={closeMenu}>
                    Suppliers
                  </NavLink>
                  <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
                    Admin
                  </NavLink>
                  <NavLink to="/sales-report" className="nav-link" onClick={closeMenu}>
                    Sales Report
                  </NavLink>
                </>
              )}

              {role === "staff" && (
                <>
                  <NavLink to="/procurements" className="nav-link" onClick={closeMenu}>
                    Procurement
                  </NavLink>
                  <NavLink to="/staff" className="nav-link" onClick={closeMenu}>
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
        <div className="navbar-right">
          <span className="role-badge">
            {role === "admin" && "👑 Admin"}
            {role === "staff" && "👷 Staff"}
            {role === "customer" && "🛒 Customer"}
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* ================= OLD INLINE VERSION (REFERENCE) ================= */}
      {/*
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
        ...
      </nav>
      */}
    </nav>
  );
}

export default Navbar;
