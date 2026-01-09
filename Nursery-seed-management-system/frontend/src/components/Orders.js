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

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Place new order
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

  // Calculate total price
  const calculateTotal = () => {
    if (!form.product || !form.quantity) return 0;
    const selected = inventory.find((i) => i._id === form.product);
    return selected ? selected.price * form.quantity : 0;
  };

  // Update order status
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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Orders</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Place Order Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <select name="customer" value={form.customer} onChange={handleChange} required>
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
        <br />

        <select name="product" value={form.product} onChange={handleChange} required>
          <option value="">Select Product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.type}) - {item.quantity} available - ₹{item.price}
            </option>
          ))}
        </select>
        <br />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          min="1"
        />
        <br />

        <p>Total: ₹{calculateTotal()}</p>

        <button
          type="submit"
          disabled={!form.customer || !form.product || !form.quantity}
        >
          Place Order
        </button>
      </form>

      {/* Orders List */}
      <h3>Existing Orders</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customer?.name} ({order.customer?.email})</td>
                <td>{order.status}</td>
                <td>
                  <ul>
                    {order.items.map((i, idx) => (
                      <li key={idx}>
                        {i.product?.name} ({i.product?.type}) — Qty: {i.quantity} — ₹{i.product?.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.totalAmount}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
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
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Orders;