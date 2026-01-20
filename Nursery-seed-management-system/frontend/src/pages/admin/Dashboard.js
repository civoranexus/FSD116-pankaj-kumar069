import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // ensure this path is correct

function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // customer | staff | admin
  const userId = localStorage.getItem("userId"); // customer id

  // Data state
  const [stats, setStats] = useState({
    totalSeeds: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // For customer: show only their orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "customer") {
          // Customer → only their orders
          const res = await API.get("/orders/myorders");
          setOrders(res.data);

          // stats for customer
          setStats({
            totalSeeds: 0,
            totalOrders: res.data.length,
            revenue: res.data.reduce((sum, o) => sum + o.totalAmount, 0),
            pendingOrders: res.data.filter((o) => o.status === "Pending").length,
          });
        } else {
          // Staff/Admin → all orders
          const res = await API.get("/orders");
          setOrders(res.data);

          // stats for staff/admin
          setStats({
            totalSeeds: 0,
            totalOrders: res.data.length,
            revenue: res.data.reduce((sum, o) => sum + o.totalAmount, 0),
            pendingOrders: res.data.filter((o) => o.status === "Pending").length,
          });
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  // Dashboard cards data
  const statsData = [
    { title: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "linear-gradient(135deg,#2196F3,#64B5F6)" },
    { title: "Revenue", value: stats.revenue, icon: "💰", color: "linear-gradient(135deg,#FF9800,#FFB74D)" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "linear-gradient(135deg,#F44336,#E57373)" },
  ];

  // Quick actions based on role
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Welcome to Nursery Seed Management
      </h1>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <span style={{ fontWeight: "bold" }}>
          Logged in as: {role.toUpperCase()}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {statsData.map((stat, index) => (
          <div
            key={index}
            style={{
              background: stat.color,
              color: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "40px", marginBottom: "10px" }}>{stat.icon}</span>
            <h3 style={{ marginBottom: "5px" }}>{stat.title}</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {stat.title === "Revenue" ? `₹${stat.value}` : stat.value}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.link)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: action.color,
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "36px", marginBottom: "10px" }}>{action.icon}</span>
            <span>{action.title}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          {role === "customer" ? "Your Orders" : "Recent Orders"}
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading orders...</p>
        ) : (
          <div>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center" }}>No orders found.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Order ID</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Status</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{o._id}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{o.status}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>₹{o.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
