import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for SPA navigation

// ✅ Mock data for frontend
const statsData = [
  { title: "Total Seeds", value: 120, icon: "🌱", color: "linear-gradient(135deg,#4CAF50,#81C784)" },
  { title: "Total Orders", value: 45, icon: "🛒", color: "linear-gradient(135deg,#2196F3,#64B5F6)" },
  { title: "Revenue", value: 12500, icon: "💰", color: "linear-gradient(135deg,#FF9800,#FFB74D)" },
  { title: "Pending Orders", value: 8, icon: "⏳", color: "linear-gradient(135deg,#F44336,#E57373)" },
];

const quickActions = [
  { title: "My Orders", icon: "🛒", link: "/orders", color: "#4CAF50" },
  { title: "Plant Health", icon: "🌱", link: "/health", color: "#81C784" },
  { title: "Inventory", icon: "📦", link: "/inventory", color: "#2196F3" },
  { title: "Sales Report", icon: "📊", link: "/sales-report", color: "#FF9800" },
];

// Mini sparkline data
const sparklineData = [50, 80, 65, 90, 120, 100];

function Dashboard() {
  const navigate = useNavigate(); // ✅ initialize navigate

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      {/* Welcome */}
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Welcome to Nursery Seed Management</h1>

      {/* Stats Cards */}
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

            {/* Sparkline mini-chart */}
            <div style={{ display: "flex", gap: "2px", marginTop: "15px", height: "20px", width: "100%" }}>
              {sparklineData.map((val, i) => (
                <div
                  key={i}
                  style={{
                    height: `${val / 5}px`,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    borderRadius: "2px",
                    flex: 1,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {quickActions.map((action, index) => {
          // ✅ If Sales Report, use navigate() instead of <a href>
          const handleClick = () => {
            if (action.title === "Sales Report") {
              navigate(action.link);
            } else {
              navigate(action.link); // You can also use navigate for all actions
            }
          };

          return (
            <div
              key={index}
              onClick={handleClick}
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
                cursor: "pointer", // make it clickable
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: "36px", marginBottom: "10px" }}>{action.icon}</span>
              <span>{action.title}</span>
            </div>
          );
        })}
      </div>

      {/* Monthly Sales Chart Placeholder */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Monthly Sales</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "200px" }}>
          {sparklineData.map((val, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: "#4CAF50",
                height: `${val}px`,
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
              title={`Month ${i + 1}: ${val}`}
            ></div>
          ))}
        </div>
      </div>

      {/* ✅ Commented old code for reference */}
      {/*
      Original Dashboard code:
      <div style={{ padding: "2rem" }}>
        <h2>Dashboard</h2>
        <p>Welcome, <strong>{role.toUpperCase()}</strong>!</p>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <div className="card">Total Orders: {summary.totalOrders}</div>
          <div className="card">Items Sold: {summary.totalItemsSold}</div>
          <div className="card">Revenue: ₹{summary.totalRevenue}</div>
        </div>
        <h3>Quick Links</h3>
        <ul>
          ...links
        </ul>
      </div>
      */}
    </div>
  );
}

export default Dashboard;
