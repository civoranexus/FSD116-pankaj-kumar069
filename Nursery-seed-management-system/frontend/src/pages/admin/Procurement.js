import React, { useState, useEffect } from "react";
import API from "../../api";

function Procurement() {
  const [procurements, setProcurements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    supplier: "",
    productName: "",
    quantity: "",
    cost: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch suppliers, inventory, and procurements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supRes = await API.get("/suppliers");
        setSuppliers(supRes.data);

        const invRes = await API.get("/inventory");
        setInventory(invRes.data);

        const procRes = await API.get("/procurements");
        setProcurements(procRes.data);
      } catch (error) {
        console.error("Error fetching procurement data:", error);
        setMessage({ type: "error", text: "Failed to load procurement data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        supplier: form.supplier,
        productName: form.productName,
        quantity: Number(form.quantity),
        cost: Number(form.cost),
      };

      if (payload.quantity <= 0 || payload.cost <= 0) {
        setMessage({ type: "error", text: "Quantity and Cost must be greater than 0." });
        return;
      }

      const res = await API.post("/procurements", payload);
      setProcurements([...procurements, res.data.procurement]);
      setForm({ supplier: "", productName: "", quantity: "", cost: "" });
      setMessage({ type: "success", text: "Procurement recorded successfully!" });
    } catch (error) {
      console.error("Error adding procurement:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding procurement.",
      });
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Procurement Tracking</h2>

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

      {/* Add Procurement Form */}
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
        <select
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="productName"
          value={form.productName}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.type})
            </option>
          ))}
        </select>

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
          name="cost"
          type="number"
          placeholder="Cost (₹)"
          value={form.cost}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

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
          Record Procurement
        </button>
      </form>

      {/* Procurement List */}
      <h3 style={{ marginBottom: "15px" }}>Procurement Records</h3>
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
          <p style={{ textAlign: "center" }}>Loading procurements...</p>
        ) : procurements.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={thStyle}>Supplier</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {procurements.map((p) => (
                <tr key={p._id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{p.supplier?.name}</td>
                  <td style={tdStyle}>{p.productName?.name}</td>
                  <td style={tdStyle}>{p.quantity}</td>
                  <td style={tdStyle}>{p.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No procurement records found.</p>
        )}
      </div>

      {/* ✅ Original code preserved for reference */}
      {/*
      Original form:
      <form onSubmit={handleSubmit}>
        <select name="supplier" value={form.supplier} onChange={handleChange}>...</select>
        <select name="productName" value={form.productName} onChange={handleChange}>...</select>
        <input name="quantity" type="number" ... />
        <input name="cost" type="number" ... />
        <button type="submit">Record Procurement</button>
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

export default Procurement;
