import React, { useEffect, useState } from "react";
import API from "../../api"; // ✅ backend axios instance
import "../../styles/customer/orders.css";

/* ======================================================
   STAFF ORDERS COMPONENT
   - Fetch all orders for staff/admin
   - Display customer info, items, total, status
   - Allow status updates (approve, ship, complete)
====================================================== */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH ALL ORDERS (STAFF/ADMIN)
  ========================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Ensure token is attached in API instance
      const res = await API.get("/orders"); 
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Failed to load orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
  ========================= */
  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // refresh list after update
    } catch (err) {
      console.error("Update order status error:", err);
      alert("Failed to update order status.");
    }
  };

  /* =========================
     STATUS COLOR HELPER
  ========================= */
  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "packed":
        return "purple";
      case "shipped":
        return "teal";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  /* =========================
     RENDERING
  ========================= */
  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p style={{ padding: 20 }}>No orders found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Customer Orders (Staff/Admin Panel)</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            marginBottom: 15,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          {/* ======================
              CUSTOMER INFO
          ====================== */}
          <p>
            <b>Customer:</b> {order.customer?.name || "Unknown Customer"} (
            {order.customer?.email || "No Email"})
          </p>
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
          <p>
            <b>Status:</b>{" "}
            <span style={{ color: statusColor(order.status), fontWeight: "bold" }}>
              {order.status || "pending"}
            </span>
          </p>

          {/* ======================
              ORDER ITEMS
          ====================== */}
          <div style={{ marginTop: "10px" }}>
            <b>Items:</b>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.product?.name || "Seed"} × {item.quantity} (@ ₹{item.price})
                </li>
              ))}
            </ul>
          </div>

          {/* ======================
              STAFF ACTIONS
          ====================== */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => updateStatus(order._id, "confirmed")}
              style={{
                marginRight: 10,
                padding: "5px 10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              ✅ Confirm
            </button>

            <button
              onClick={() => updateStatus(order._id, "shipped")}
              style={{
                marginRight: 10,
                padding: "5px 10px",
                backgroundColor: "teal",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              🚚 Ship
            </button>

            <button
              onClick={() => updateStatus(order._id, "completed")}
              style={{
                padding: "5px 10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              📬 Complete
            </button>
          </div>

          {/* ======================
              ❌ OLD SIMPLE VERSION
          ====================== */}
          {/*
          <div>
            {orders.map(o => (
              <div key={o._id}>
                {o.customer.name} - ₹{o.totalAmount}
              </div>
            ))}
          </div>
          */}
        </div>
      ))}
    </div>
  );
};

export default Orders;
