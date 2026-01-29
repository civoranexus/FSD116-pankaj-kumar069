import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

/* ✅ Customer Dashboard Professional Styles */
import "../../styles/customer/CustomerDashboard.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  /* ===============================
     REAL DATA STATES
  =============================== */
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH CUSTOMER ORDERS (API)
  =============================== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (Array.isArray(data)) {
          setOrders(data);

          // 🔥 Total amount calculation
          const sum = data.reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0
          );
          setTotalAmount(sum);
        } else {
          setOrders([]);
          setTotalAmount(0);
        }
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ===============================
     STATES HANDLING
  =============================== */
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  /* ===============================
     DERIVED DATA
  =============================== */
  const recentOrders = orders.slice(0, 5); // 🔥 latest 5 orders

  return (
    <div className="customer-dashboard">
      {/* ===============================
          HEADER
      =============================== */}
      <header className="dashboard-header">
        <h2>👋 Welcome Back!</h2>
        <p>Track your orders, explore seeds, and manage your shopping efficiently.</p>
      </header>

      {/* ===============================
          DASHBOARD ACTION CARDS
      =============================== */}
      <div className="dashboard-action-cards">
        <div
          className="action-card"
          onClick={() => navigate("/cart")}
        >
          <h3>🛒 My Cart</h3>
          <p>View & update your cart</p>
          {/* Badge placeholder */}
          {/* <span className="card-badge">2</span> */}
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/my-orders")}
        >
          <h3>📦 My Orders</h3>
          <p>Track all your orders</p>
          <span className="card-badge">{orders.length}</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/seeds")}
        >
          <h3>🌱 Browse Seeds</h3>
          <p>Explore quality seeds</p>
        </div>
      </div>

      {/* ===============================
          OVERVIEW STATS CARDS
      =============================== */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>

        <div className="stats-card">
          <h4>Total Spent</h4>
          <p>₹{totalAmount}</p>
        </div>
      </div>

      {/* ===============================
          RECENT ORDERS LIST (CARD STYLE)
      =============================== */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p className="empty-text">No recent orders found.</p>
        ) : (
          <div className="recent-orders-grid">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="order-card"
                onClick={() => navigate("/my-orders")}
              >
                <div className="order-card-header">
                  <span className="order-number">
                    #{order.orderNumber || order._id.slice(-6)}
                  </span>
                  <span
                    className={`order-status ${order.status?.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-card-body">
                  <p><b>Customer:</b> {order.customerName || "You"}</p>
                  <p><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><b>Total:</b> ₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ❌ OLD DASHBOARD CODE (COMMENTED FOR REFERENCE)
      <div>
        <h2>My Dashboard</h2>
        <p>Total Orders: 0</p>
        <p>Total Amount: ₹0</p>
      </div>
      */}
    </div>
  );
};

export default CustomerDashboard;
