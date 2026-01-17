import React, { useState, useEffect } from "react";
import API from "../../api";

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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory Management</h2>

      {/* Feedback messages */}
      {message.text && (
        <p
          style={{
            color: message.type === "error" ? "#f44336" : "#4CAF50",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {message.text}
        </p>
      )}

      {/* Add Stock Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Type</option>
          <option value="seed">Seed</option>
          <option value="sapling">Sapling</option>
          <option value="plant">Plant</option>
        </select>

        <input
          name="batchId"
          placeholder="Batch ID"
          value={form.batchId}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Ready for Sale">Ready for Sale</option>
          <option value="Under Treatment">Under Treatment</option>
        </select>

        <button
          type="submit"
          style={{
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
        >
          Add Stock
        </button>
      </form>

      {/* Inventory List */}
      <h3 style={{ marginBottom: "15px" }}>Current Inventory</h3>
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading inventory...</p>
        ) : items.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Batch ID</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Price (₹)</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.batchId}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>{item.price}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: getStatusColor(item.status) }}>
                    {item.status}
                  </td>
                  <td style={tdStyle}>{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No inventory records found.</p>
        )}
      </div>

      {/* ✅ Commented original form & table styling preserved */}
      {/*
      Original form:
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange} required>...</select>
        ...
        <button type="submit">Add Stock</button>
      </form>

      Original table:
      <table border="1" cellPadding="5">...</table>
      */}
    </div>
  );
}

// ✅ Styles
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

// ✅ Status color function
function getStatusColor(status) {
  switch (status) {
    case "Available":
      return "#4CAF50";
    case "Low Stock":
      return "#FF9800";
    case "Ready for Sale":
      return "#2196F3";
    case "Under Treatment":
      return "#f44336";
    default:
      return "#000";
  }
}

export default Inventory;
