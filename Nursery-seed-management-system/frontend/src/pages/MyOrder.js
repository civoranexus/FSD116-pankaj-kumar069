import React, { useEffect, useState } from "react";
import API from "../api";

/* =====================================================
   MY ORDERS PAGE (Customer Only)
   - Fetch orders from backend
   - Show order status, items, total
===================================================== */

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await API.get("/orders/myorders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching my orders:", err);
        setError("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading your orders...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Items</th>
              <th style={thStyle}>Total (₹)</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={tdStyle}>{order._id}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td style={tdStyle}>
                  <ul style={{ paddingLeft: "15px", textAlign: "left" }}>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.product?.name} ({item.product?.type}) ×{" "}
                        {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={tdStyle}>₹{order.totalAmount}</td>
                <td style={tdStyle}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ❌ OLD BASIC CODE (preserved for learning)
      <div style={{ padding: "20px" }}>
        <h2>My Orders</h2>
        <p>Here you will see all your placed orders.</p>
      </div>
      */}
    </div>
  );
};

/* ------------------ styles ------------------ */
const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #ccc",
  textAlign: "center",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "center",
};

export default MyOrders;
