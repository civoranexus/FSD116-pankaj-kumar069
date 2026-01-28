import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-dot" />
          Nursery Seed System
        </div>

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
                    {cart.length > 0 && (
                      <span
                        style={{
                          marginLeft: "6px",
                          background: "#e53935",
                          color: "#fff",
                          borderRadius: "12px",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {cart.length}
                      </span>
                    )}
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
    </nav>
  );
}

export default Navbar;
