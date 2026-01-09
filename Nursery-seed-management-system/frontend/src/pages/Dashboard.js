import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role") || "customer";

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/sales/report"); // ✅ basic summary
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error.message);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    if (role === "admin" || role === "staff") {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [role]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>

      {/* Role-based welcome */}
      <p>Welcome, <strong>{role.toUpperCase()}</strong>!</p>

      {/* Admin/Staff summary */}
      {(role === "admin" || role === "staff") && summary ? (
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <div className="card">Total Orders: {summary.totalOrders}</div>
          <div className="card">Items Sold: {summary.totalItemsSold}</div>
          <div className="card">Revenue: ₹{summary.totalRevenue}</div>
        </div>
      ) : role === "admin" || role === "staff" ? (
        <p>No sales data available yet.</p>
      ) : null}

      {/* Quick links */}
      <h3>Quick Links</h3>
      <ul>
        {role === "admin" && (
          <>
            <li><Link to="/admin">Admin Dashboard</Link></li>
            <li><Link to="/sales-report">Sales Report</Link></li>
            <li><Link to="/suppliers">Manage Suppliers</Link></li>
          </>
        )}
        {role === "staff" && (
          <>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/procurements">Procurement</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </>
        )}
        {role === "customer" && (
          <>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/health">Plant Health</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;