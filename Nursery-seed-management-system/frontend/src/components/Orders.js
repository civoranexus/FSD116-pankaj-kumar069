import React, { useState, useEffect } from "react";
import API from "../api";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ customer: "", product: "", quantity: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch inventory + orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await API.get("/inventory");
        setInventory(invRes.data);

        const ordRes = await API.get("/orders");
        setOrders(ordRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: "error", text: "Failed to load orders/inventory." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await API.get("/customers");
        setCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        customer: form.customer,
        items: [{ product: form.product, quantity: Number(form.quantity) }],
      };
      const res = await API.post("/orders", payload);
      setOrders([...orders, res.data.order]);
      setForm({ customer: "", product: "", quantity: "" });
      setMessage({ type: "success", text: "Order placed successfully!" });
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error placing order.",
      });
    }
  };

  const calculateTotal = () => {
    if (!form.product || !form.quantity) return 0;
    const selected = inventory.find((i) => i._id === form.product);
    return selected ? selected.price * form.quantity : 0;
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/orders/${id}/status`, { status });
      setOrders(orders.map((o) => (o._id === id ? res.data.order : o)));
      setMessage({ type: "success", text: "Order status updated!" });
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error updating status.",
      });
    }
  };

  // ✅ Styles
  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  };
  const thStyle = { padding: "10px", borderBottom: "1px solid #ccc", background: "#f0f0f0" };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "center" };

  const statusColor = (status) => {
    switch (status) {
      case "Pending": return "#FF9800";
      case "Confirmed": return "#2196F3";
      case "Packed": return "#FFC107";
      case "Shipped": return "#00BCD4";
      case "Completed": return "#4CAF50";
      default: return "#9E9E9E";
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Orders Management</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{
          color: message.type === "error" ? "#f44336" : "#4CAF50",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
        }}>{message.text}</p>
      )}

      {/* Place Order Form */}
      <form style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px",
      }} onSubmit={handleSubmit}>
        <select name="customer" value={form.customer} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
          ))}
        </select>

        <select name="product" value={form.product} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Product</option>
          {inventory.map((i) => (
            <option key={i._id} value={i._id}>{i.name} ({i.type}) — {i.quantity} in stock — ₹{i.price}</option>
          ))}
        </select>

        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required min="1" style={inputStyle} />

        <p style={{ alignSelf: "center" }}>Total: ₹{calculateTotal()}</p>

        <button type="submit" style={{
          gridColumn: "1 / -1",
          padding: "10px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#2196F3",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
        disabled={!form.customer || !form.product || !form.quantity}>
          Place Order
        </button>
      </form>

      {/* Orders Table */}
      <h3 style={{ marginBottom: "15px" }}>Existing Orders</h3>
      <div style={{
        overflowX: "auto",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading orders...</p>
        ) : orders.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Total (₹)</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={tdStyle}>{order._id}</td>
                  <td style={tdStyle}>{order.customer?.name} ({order.customer?.email})</td>
                  <td style={{...tdStyle, color: "#fff", fontWeight: "bold", backgroundColor: statusColor(order.status), borderRadius: "6px"}}>{order.status}</td>
                  <td style={tdStyle}>
                    <ul style={{paddingLeft: "10px", textAlign: "left"}}>
                      {order.items.map((i, idx) => (
                        <li key={idx}>{i.product?.name} ({i.product?.type}) — Qty: {i.quantity} — ₹{i.product?.price}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={tdStyle}>{order.totalAmount}</td>
                  <td style={tdStyle}>
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} style={inputStyle}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No orders found.</p>
        )}
      </div>

      {/* ✅ Original code preserved */}
      {/*
      Original form:
      <form onSubmit={handleSubmit}> ... </form>

      Original table:
      <table border="1" cellPadding="5"> ... </table>
      */}
    </div>
  );
}

export default Orders;
