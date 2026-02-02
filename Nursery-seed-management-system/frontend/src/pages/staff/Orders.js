import React, { useEffect, useState } from "react";
import API from "../../api";
import "../../styles/customer/orders.css";

/* ======================================================
   STAFF / ADMIN ORDERS
   - Professional Orders List
   - Expandable Order Details
   - Full Status Flow Control
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

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
     - Safe, backend enum compliant
  ========================= */
  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // refresh after update
    } catch (err) {
      console.error("Update status error:", err.response || err);
      alert(
        err.response?.data?.message ||
          "Failed to update order status (check role or status)"
      );
    }
  };

  /* =========================
     STATUS COLOR
  ========================= */
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

  /* =========================
     CHECK IF STATUS IS CLICKABLE
     - Only next status is enabled
     - Past statuses disabled
  ========================= */
  const isStatusDisabled = (currentStatus, buttonStatus) => {
    const currentIndex = ORDER_FLOW.indexOf(currentStatus);
    const buttonIndex = ORDER_FLOW.indexOf(buttonStatus);
    return buttonIndex <= currentIndex; // disable past & current
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  if (orders.length === 0)
    return <p style={{ padding: 20 }}>📦 No orders found</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>📦 Customer Orders (Staff / Admin)</h2>

      <table style={table}>
        <thead>
          <tr style={thead}>
            <th style={th}>Order ID</th>
            <th style={th}>Customer</th>
            <th style={th}>Amount</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              {/* ===== SUMMARY ROW ===== */}
              <tr style={row}>
                <td style={td}>{order._id.slice(-6)}</td>
                <td style={td}>{order.customer?.name || "Customer"}</td>
                <td style={td}>₹{order.totalAmount}</td>
                <td style={td}>
                  <span
                    style={{
                      color: statusColor(order.status),
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={td}>
                  <button
                    style={viewBtn}
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order._id ? null : order._id
                      )
                    }
                  >
                    👁 View
                  </button>
                </td>
              </tr>

              {/* ===== DETAILS ===== */}
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan="5" style={detailsRow}>
                    <div style={detailsBox}>
                      <p>
                        <b>Customer:</b> {order.customer?.name} (
                        {order.customer?.email})
                      </p>
                      <p>
                        <b>Order ID:</b> {order._id}
                      </p>
                      <p>
                        <b>Total:</b> ₹{order.totalAmount}
                      </p>

                      <div>
                        <b>Items:</b>
                        <ul>
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.product?.name || "Seed"} ×{" "}
                              {item.quantity} (@ ₹{item.price})
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* ===== STATUS ACTION BUTTONS ===== */}
                      <div style={{ marginTop: 12 }}>
                        {ORDER_FLOW.map((status, i) => (
                          <button
                            key={i}
                            style={{
                              ...actionBtn,
                              background: statusColor(status),
                              opacity: isStatusDisabled(order.status, status)
                                ? 0.5
                                : 1,
                              cursor: isStatusDisabled(order.status, status)
                                ? "not-allowed"
                                : "pointer",
                            }}
                            disabled={isStatusDisabled(order.status, status)}
                            onClick={() => updateStatus(order._id, status)}
                          >
                            {status === "confirmed" && "✅ Confirm"}
                            {status === "packed" && "📦 Packed"}
                            {status === "shipped" && "🚚 Shipped"}
                            {status === "delivered" && "📬 Delivered"}
                            {status === "completed" && "✔ Complete"}
                            {status === "placed" && "📌 Placed"}
                            {status === "cancelled" && "❌ Cancelled"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* =====================================================
         ❌ OLD VERSION (REFERENCE ONLY – DO NOT DELETE)
      ===================================================== */}
      {/*
      orders.map(order => (
        <div key={order._id}>
          {order.customer?.name} - ₹{order.totalAmount}
        </div>
      ))
      */}
    </div>
  );
};

/* =========================
   STYLES
========================= */
const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const thead = {
  background: "#f1f5f9",
  textAlign: "left",
};

const row = {
  borderBottom: "1px solid #e5e7eb",
};

const th = { padding: 12, fontWeight: 600 };
const td = { padding: 12 };

const viewBtn = {
  padding: "6px 10px",
  border: "1px solid #cbd5f5",
  background: "#fff",
  borderRadius: 6,
  cursor: "pointer",
};

const detailsRow = {
  background: "#f8fafc",
};

const detailsBox = {
  padding: 16,
  borderLeft: "4px solid #2563eb",
};

const actionBtn = {
  marginRight: 8,
  padding: "6px 12px",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default Orders;
