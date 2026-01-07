import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#2c3e50", color: "white" }}>
      <Link to="/" style={{ margin: "10px", color: "white" }}>Home</Link>
      <Link to="/login" style={{ margin: "10px", color: "white" }}>Login</Link>
      <Link to="/register" style={{ margin: "10px", color: "white" }}>Register</Link>
      <Link to="/inventory" style={{ margin: "10px", color: "white" }}>Inventory</Link>
      <Link to="/orders" style={{ margin: "10px", color: "white" }}>Orders</Link>
      <Link to="/suppliers" style={{ margin: "10px", color: "white" }}>Suppliers</Link>
      <Link to="/procurements" style={{ margin: "10px", color: "white" }}>Procurement</Link>
      <Link to="/health" style={{ margin: "10px", color: "white" }}>Health</Link>
      <Link to="/admin" style={{ margin: "10px", color: "white" }}>Admin</Link>
    </nav>
  );
}

export default Navbar;