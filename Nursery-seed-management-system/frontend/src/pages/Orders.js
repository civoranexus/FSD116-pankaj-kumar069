import React, { useState, useEffect } from "react";
import API from "../api";

function Orders() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ customer: "", product: "", quantity: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ALWAYS run hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await API.get("/inventory");
        setInventory(invRes.data.inventory || invRes.data || []);

        // Staff/Admin -> all orders
        const ordRes = await API.get("/orders");
        setOrders(ordRes.data.orders || ordRes.data || []);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load data." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (role === "admin" || role === "staff") {
          const res = await API.get("/customers");
          setCustomers(res.data.customers || res.data || []);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const product = inventory.find((i) => i._id === form.product);
    return product ? product.price * Number(form.quantity || 0) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        customer:
          role === "customer" ? userId : form.customer,
        items: [{ product: form.product, quantity: Number(form.quantity) }],
      };

      const res = await API.post("/orders", payload);
      const newOrder = res.data.order || res.data;

      setOrders((prev) => [...prev, newOrder]);
      setForm({ customer: "", product: "", quantity: "" });

      setMessage({ type: "success", text: "Order placed successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Order failed.",
      });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/orders/${id}/status`, { status });
      const updated = res.data.order || res.data;

      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      setMessage({ type: "success", text: "Status updated!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Status update failed.",
      });
    }
  };

  // Customer should NOT access staff/admin page
  if (role === "customer") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        ❌ You do not have permission to view this page.
      </div>
    );
  }

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

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
  };

  return (
    <div style={{ padding: "2rem", background: "#f5f6fa" }}>
      <h2 style={{ textAlign: "center" }}>Orders Management</h2>

      {message.text && (
        <p style={{
          textAlign: "center",
          fontWeight: "bold",
          color: message.type === "error" ? "#f44336" : "#4CAF50",
        }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px",
        display: "grid",
        gap: "15px",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}>
        {/* Customer dropdown for staff/admin */}
        <select
          name="customer"
          value={form.customer}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <select
          name="product"
          value={form.product}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Product</option>
          {inventory.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name} — ₹{i.price} — Stock: {i.quantity}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="1"
          placeholder="Quantity"
          required
          style={inputStyle}
        />

        <p>Total: ₹{calculateTotal()}</p>

        <button
          type="submit"
          style={{
            gridColumn: "1 / -1",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#2196F3",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Place Order
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        <table style={{ width: "100%", background: "#fff", borderRadius: "12px" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.customer?.name}</td>
                <td>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    background: statusColor(o.status),
                    color: "#fff",
                  }}>
                    {o.status}
                  </span>
                </td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} style={inputStyle}>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
