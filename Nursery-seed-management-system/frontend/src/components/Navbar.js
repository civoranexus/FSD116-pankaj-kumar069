import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    margin: "10px",
    color: "white",
    textDecoration: isActive ? "underline" : "none",
  });

  return (
    <nav style={{ padding: "10px", background: "#2c3e50", color: "white" }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>

      {!token && (
        <>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
          <NavLink to="/register" style={linkStyle}>Register</NavLink>
        </>
      )}

      {token && (
        <>
          <NavLink to="/inventory" style={linkStyle}>Inventory</NavLink>
          <NavLink to="/orders" style={linkStyle}>Orders</NavLink>

          {/* Role-based links */}
          {role === "admin" && (
            <>
              <NavLink to="/suppliers" style={linkStyle}>Suppliers</NavLink>
              <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
              <NavLink to="/sales-report" style={linkStyle}>Sales Report</NavLink>
            </>
          )}
          {role === "staff" && (
            <NavLink to="/procurements" style={linkStyle}>Procurement</NavLink>
          )}
          <NavLink to="/health" style={linkStyle}>Health</NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "20px",
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;