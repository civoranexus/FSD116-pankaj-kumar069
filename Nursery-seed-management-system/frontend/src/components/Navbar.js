import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

/**
 * ==========================================
 * Navbar Component
 * ------------------------------------------
 * - Role based navigation
 * - Responsive (hamburger)
 * - Professional structure
 * ==========================================
 */

function Navbar() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // ------------------------------------------
  // 🔐 AUTH DATA
  // ------------------------------------------
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ------------------------------------------
  // 📱 MOBILE MENU STATE
  // ------------------------------------------
  const [menuOpen, setMenuOpen] = useState(false);

  // ------------------------------------------
  // 🚪 LOGOUT HANDLER
  // ------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* =========================
          LEFT SECTION
         ========================= */}
      <div className="navbar-left">
        {/* Brand / Logo */}
        <div
          className="navbar-brand"
          onClick={() => navigate("/")}
          role="button"
        >
          <span className="brand-dot" />
          <span className="brand-text">Nursery Seed System</span>
        </div>

        {/* Hamburger (Mobile) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {/* Public */}
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            Home
          </NavLink>

          {/* -------------------------
              NOT LOGGED IN
             ------------------------- */}
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

          {/* -------------------------
              LOGGED IN
             ------------------------- */}
          {token && (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>

              {/* -------- CUSTOMER -------- */}
              {role === "customer" && (
                <>
                  <NavLink
                    to="/my-orders"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    My Orders
                  </NavLink>

                  <NavLink
                    to="/cart"
                    className="nav-link cart-link"
                    onClick={closeMenu}
                  >
                    Cart
                    {cart.length > 0 && (
                      <span className="cart-badge">{cart.length}</span>
                    )}
                  </NavLink>

                  <NavLink
                    to="/place-order"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Place Order
                  </NavLink>
                </>
              )}

              {/* -------- ADMIN & STAFF -------- */}
              {(role === "admin" || role === "staff") && (
                <>
                  <NavLink
                    to="/inventory"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Inventory
                  </NavLink>

                  <NavLink
                    to="/orders"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/health"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Health
                  </NavLink>
                </>
              )}

              {/* -------- ADMIN ONLY -------- */}
              {role === "admin" && (
                <>
                  <NavLink
                    to="/suppliers"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Suppliers
                  </NavLink>

                  <NavLink
                    to="/admin"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </NavLink>

                  <NavLink
                    to="/sales-report"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Sales Report
                  </NavLink>
                </>
              )}

              {/* -------- STAFF ONLY -------- */}
              {role === "staff" && (
                <>
                  <NavLink
                    to="/procurements"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Procurement
                  </NavLink>

                  <NavLink
                    to="/staff"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Staff Dashboard
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* =========================
          RIGHT SECTION
         ========================= */}
      {token && (
        <div className="navbar-right">
          <span className={`role-badge ${role}`}>
            {/* ❌ OLD
            {role === "admin" && "👑 Admin"}
            {role === "staff" && "👷 Staff"}
            {role === "customer" && "🛒 Customer"}
            */}

            {/* ✅ Professional (emoji optional in CSS later) */}
            {role.toUpperCase()}
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
