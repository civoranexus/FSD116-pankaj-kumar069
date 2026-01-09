import React, { useState, useEffect } from "react";
import API from "../api";

function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    batchId: "",
    quantity: "",
    location: "",
    price: "",
    status: "Available",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch inventory on load
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await API.get("/inventory");
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setMessage({ type: "error", text: "Failed to load inventory." });
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      if (payload.quantity <= 0 || payload.price <= 0) {
        setMessage({ type: "error", text: "Quantity and Price must be greater than 0." });
        return;
      }

      const res = await API.post("/inventory", payload);
      setItems([...items, res.data.stock]);
      setForm({
        name: "",
        type: "",
        batchId: "",
        quantity: "",
        location: "",
        price: "",
        status: "Available",
      });
      setMessage({ type: "success", text: "Stock added successfully!" });
    } catch (error) {
      console.error("Error adding stock:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding stock.",
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Inventory Management</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Add Stock Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />

        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="seed">Seed</option>
          <option value="sapling">Sapling</option>
          <option value="plant">Plant</option>
        </select><br />

        <input
          name="batchId"
          placeholder="Batch ID"
          value={form.batchId}
          onChange={handleChange}
          required
        /><br />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          min="1"
        /><br />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        /><br />

        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
          min="1"
        /><br />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Ready for Sale">Ready for Sale</option>
          <option value="Under Treatment">Under Treatment</option>
        </select><br />

        <button type="submit">Add Stock</button>
      </form>

      {/* Inventory List */}
      <h3>Current Inventory</h3>
      {loading ? (
        <p>Loading inventory...</p>
      ) : items.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Batch ID</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.batchId}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.status}</td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No inventory records found.</p>
      )}
    </div>
  );
}

export default Inventory;