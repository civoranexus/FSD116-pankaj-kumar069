import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

/* ✅ Customer Dashboard UX styles */
import "../../styles/customer/dashboard.css";

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
  const recentOrders = orders.slice(0, 3); // 🔥 latest 3 orders

  return (
    <div className="customer-dashboard">
      {/* ===============================
          HEADER
      =============================== */}
      <div className="dashboard-header">
        <h2>👋 My Dashboard</h2>
        <p>Welcome back! Track your orders and manage shopping easily.</p>
      </div>

      {/* ===============================
          DASHBOARD CARDS (WITH BADGES)
      =============================== */}
      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => navigate("/cart")}
        >
          <h3>🛒 My Cart</h3>
          <p>View and update cart items</p>

          {/* 🔥 Badge placeholder (future cart count) */}
          {/* <span className="card-badge">2</span> */}
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/my-orders")}
        >
          <h3>📦 My Orders</h3>
          <p>Track all your orders</p>

          {/* 🔥 LIVE ORDERS COUNT */}
          <span className="card-badge">
            {orders.length}
          </span>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/seeds")}
        >
          <h3>🌱 Browse Seeds</h3>
          <p>Explore and buy quality seeds</p>
        </div>
      </div>

      {/* ===============================
          OVERVIEW STATS
      =============================== */}
      <div className="recent-orders">
        <h3>Overview</h3>

        <div className="recent-order-item">
          <span>Total Orders</span>
          <span className="order-status">
            {orders.length}
          </span>
        </div>

        <div className="recent-order-item">
          <span>Total Amount Spent</span>
          <span className="order-status">
            ₹{totalAmount}
          </span>
        </div>
      </div>

      {/* ===============================
          RECENT ORDERS LIST (LIVE)
      =============================== */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p className="empty-text">
            No recent orders found.
          </p>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order._id}
              className="recent-order-item"
              onClick={() => navigate("/my-orders")}
            >
              <div>
                <b>Order</b>{" "}
                {order.orderNumber || order._id.slice(-6)}
                <br />
                <small>
                  {new Date(order.createdAt).toLocaleDateString()}
                </small>
              </div>

              <span
                className={`order-status ${order.status?.toLowerCase()}`}
              >
                {order.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ❌ OLD / PREVIOUS DASHBOARD CODE (COMMENTED – NOT DELETED)
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
