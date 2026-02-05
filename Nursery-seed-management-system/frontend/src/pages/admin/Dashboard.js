import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;

        if (role === "customer") {
          res = await API.get("/orders/my-orders");
        } else {
          res = await API.get("/orders");
        }

        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);

        setStats({
          totalOrders: data.length,
          revenue: data.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
          pendingOrders: data.filter((o) => o.status === "pending").length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  /* ======================================================
     🔴 ONLY ADMIN – CLEAN PROFESSIONAL DASHBOARD
     ❌ NO RECENT ORDERS SECTION
  ====================================================== */
  if (role === "admin") {
    return (
      <div style={adminContainer}>
        <div style={adminHeader}>
          <h1>Admin Dashboard</h1>
          <span style={roleBadge}>ADMIN</span>
        </div>

        {/* STATS */}
        <div style={statsGrid}>
          <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" />
          <StatCard title="Revenue" value={`₹${stats.revenue}`} icon="💰" />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="⏳"
          />
        </div>

        {/* QUICK ACTIONS */}
        <h2 style={{ marginTop: 32 }}>Quick Actions</h2>
        <div style={actionsGrid}>
          <ActionCard
            title="Orders"
            icon="🛒"
            onClick={() => navigate("/orders")}
          />
          <ActionCard
            title="Inventory"
            icon="📦"
            onClick={() => navigate("/inventory")}
          />
          <ActionCard
            title="Customers"
            icon="👥"
            onClick={() => navigate("/customers")}
          />
          <ActionCard
            title="Reports"
            icon="📊"
            onClick={() => navigate("/sales-report")}
          />
        </div>
      </div>
    );
  }

  /* ======================================================
     🟢 STAFF + CUSTOMER – OLD DASHBOARD (UNCHANGED)
  ====================================================== */
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome</h1>
      <p>
        Logged in as: <b>{role?.toUpperCase()}</b>
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.status}</td>
                <td>₹{o.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ======================================================
   SMALL UI COMPONENTS (ADMIN ONLY)
====================================================== */

const StatCard = ({ title, value, icon }) => (
  <div style={statCard}>
    <div style={{ fontSize: 30 }}>{icon}</div>
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

const ActionCard = ({ title, icon, onClick }) => (
  <div style={actionCard} onClick={onClick}>
    <div style={{ fontSize: 28 }}>{icon}</div>
    <p>{title}</p>
  </div>
);

/* =========================
   STYLES
========================= */

const adminContainer = {
  padding: 24,
  background: "#f8fafc",
  minHeight: "100vh",
};

const adminHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const roleBadge = {
  background: "#2563eb",
  color: "#fff",
  padding: "6px 14px",
  borderRadius: 20,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginTop: 20,
};

const statCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const actionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 16,
  marginTop: 16,
};

const actionCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

export default Dashboard;
