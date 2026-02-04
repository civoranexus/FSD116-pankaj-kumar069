import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalSeeds: 0,
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
          // ✅ FIXED ROUTE
          res = await API.get("/orders/my-orders");
        } else {
          res = await API.get("/orders");
        }

        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);

        setStats({
          totalSeeds: 0,
          totalOrders: data.length,
          revenue: data.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
          pendingOrders: data.filter((o) => o.status === "pending").length,
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  /* UI CODE BELOW — unchanged */
  const statsData = [
    { title: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "linear-gradient(135deg,#2196F3,#64B5F6)" },
    { title: "Revenue", value: stats.revenue, icon: "💰", color: "linear-gradient(135deg,#FF9800,#FFB74D)" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "linear-gradient(135deg,#F44336,#E57373)" },
  ];

  const quickActionsCustomer = [
    { title: "My Orders", icon: "🛒", link: "/my-orders", color: "#4CAF50" },
    { title: "Cart", icon: "🛍️", link: "/cart", color: "#81C784" },
    { title: "Plant Health", icon: "🌱", link: "/health", color: "#2196F3" },
  ];

  const quickActionsStaffAdmin = [
    { title: "Orders", icon: "🛒", link: "/orders", color: "#4CAF50" },
    { title: "Inventory", icon: "📦", link: "/inventory", color: "#2196F3" },
    { title: "Sales Report", icon: "📊", link: "/sales-report", color: "#FF9800" },
    { title: "Customers", icon: "👥", link: "/customers", color: "#9C27B0" },
  ];

  const quickActions = role === "customer" ? quickActionsCustomer : quickActionsStaffAdmin;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f6fa" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to Nursery Seed Management</h1>

      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        Logged in as: {role?.toUpperCase()}
      </p>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
        {statsData.map((stat, i) => (
          <div key={i} style={{ background: stat.color, color: "#fff", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "40px" }}>{stat.icon}</div>
            <h3>{stat.title}</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {stat.title === "Revenue" ? `₹${stat.value}` : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <h2 style={{ marginTop: "40px", textAlign: "center" }}>
        {role === "customer" ? "Your Orders" : "Recent Orders"}
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
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

export default Dashboard;
