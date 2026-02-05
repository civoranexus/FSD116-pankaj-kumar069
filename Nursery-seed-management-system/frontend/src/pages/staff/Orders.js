import React, { useEffect, useState } from "react";
import API from "../../api";
import "../../styles/customer/orders.css";

/* ======================================================
   STAFF / ADMIN ORDERS – CARD BASED & RESPONSIVE
   (UI/UX ONLY – FUNCTIONALITY UNCHANGED)
====================================================== */

const ORDER_FLOW = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "completed",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  const statusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "placed":
        return "#64748b";
      case "confirmed":
        return "#2563eb";
      case "packed":
        return "#7c3aed";
      case "shipped":
        return "#0d9488";
      case "delivered":
        return "#16a34a";
      case "completed":
        return "#15803d";
      case "cancelled":
        return "#dc2626";
      default:
        return "#334155";
    }
  };

  const isStatusDisabled = (currentStatus, buttonStatus) => {
    const currentIndex = ORDER_FLOW.indexOf(currentStatus);
    const buttonIndex = ORDER_FLOW.indexOf(buttonStatus);
    return buttonIndex <= currentIndex;
  };

  if (loading) return <p style={stateText}>Loading orders…</p>;
  if (error) return <p style={{ ...stateText, color: "#dc2626" }}>{error}</p>;
  if (orders.length === 0) return <p style={stateText}>📦 No orders found</p>;

  return (
    <div style={container}>
      <h2 style={title}>📦 Customer Orders</h2>

      <div style={cardGrid}>
        {orders.map((order) => (
          <div key={order._id} style={orderCard}>
            <div style={cardHeader}>
              <div>
                <div style={orderId}>#{order._id.slice(-6)}</div>
                <div style={customerName}>
                  {order.customer?.name || "Customer"}
                </div>
              </div>
              <span
                style={{
                  ...statusBadge,
                  background: statusColor(order.status),
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={cardBody}>
              <div style={amount}>₹{order.totalAmount}</div>
              <button
                style={viewBtn}
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order._id ? null : order._id
                  )
                }
              >
                {expandedOrderId === order._id ? "Hide Details" : "View Details"}
              </button>
            </div>

            {expandedOrderId === order._id && (
              <div style={detailsBox}>
                <div style={detailItem}>
                  <b>Order ID</b>
                  <span>{order._id}</span>
                </div>

                <div style={detailItem}>
                  <b>Email</b>
                  <span>{order.customer?.email}</span>
                </div>

                <div style={itemsBox}>
                  <b>Items</b>
                  <ul style={itemsList}>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.product?.name || "Item"} × {item.quantity} (₹
                        {item.price})
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={statusActions}>
                  {ORDER_FLOW.map((status) => (
                    <button
                      key={status}
                      style={{
                        ...actionBtn,
                        background: statusColor(status),
                        opacity: isStatusDisabled(order.status, status)
                          ? 0.4
                          : 1,
                        cursor: isStatusDisabled(order.status, status)
                          ? "not-allowed"
                          : "pointer",
                      }}
                      disabled={isStatusDisabled(order.status, status)}
                      onClick={() => updateStatus(order._id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   STYLES (CARD + RESPONSIVE)
========================= */

const container = {
  padding: 20,
  background: "#f8fafc",
  minHeight: "100vh",
};

const title = {
  marginBottom: 20,
  fontSize: 22,
  fontWeight: 700,
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
};

const orderCard = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const orderId = {
  fontSize: 13,
  color: "#64748b",
};

const customerName = {
  fontWeight: 600,
  fontSize: 15,
};

const statusBadge = {
  padding: "4px 10px",
  borderRadius: 999,
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
};

const cardBody = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const amount = {
  fontSize: 18,
  fontWeight: 700,
};

const viewBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  cursor: "pointer",
};

const detailsBox = {
  marginTop: 16,
  paddingTop: 16,
  borderTop: "1px solid #e5e7eb",
};

const detailItem = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
  marginBottom: 8,
};

const itemsBox = {
  marginTop: 10,
};

const itemsList = {
  marginTop: 6,
  paddingLeft: 18,
  fontSize: 14,
};

const statusActions = {
  marginTop: 14,
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const actionBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontSize: 13,
};

const stateText = {
  padding: 24,
};

export default Orders;
