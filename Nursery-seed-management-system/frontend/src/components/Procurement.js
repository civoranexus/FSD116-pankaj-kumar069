import React, { useState, useEffect } from "react";
import API from "../api";

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

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new procurement
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
    <div style={{ padding: "2rem" }}>
      <h2>Procurement Tracking</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Add Procurement Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <select name="supplier" value={form.supplier} onChange={handleChange} required>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select><br />

        <select name="productName" value={form.productName} onChange={handleChange} required>
          <option value="">Select Product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.type})
            </option>
          ))}
        </select><br />

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
          name="cost"
          type="number"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          required
          min="1"
        /><br />

        <button type="submit">Record Procurement</button>
      </form>

      {/* Procurement List */}
      <h3>Procurement Records</h3>
      {loading ? (
        <p>Loading procurements...</p>
      ) : procurements.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {procurements.map((p) => (
              <tr key={p._id}>
                <td>{p.supplier?.name}</td>
                <td>{p.productName?.name}</td>
                <td>{p.quantity}</td>
                <td>{p.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No procurement records found.</p>
      )}
    </div>
  );
}

export default Procurement;