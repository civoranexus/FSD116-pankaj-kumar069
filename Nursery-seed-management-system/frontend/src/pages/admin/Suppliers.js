import React, { useState, useEffect } from "react";
import API from "../../api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await API.get("/suppliers");
        setSuppliers(res.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setMessage({ type: "error", text: "Failed to load suppliers." });
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await API.post("/suppliers", form);
      setSuppliers([...suppliers, res.data.supplier]);
      setForm({ name: "", contact: "", email: "", address: "" });
      setMessage({ type: "success", text: "Supplier added successfully!" });
    } catch (error) {
      console.error("Error adding supplier:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding supplier.",
      });
    }
  };

  // Delete supplier
  const deleteSupplier = async (id) => {
    try {
      await API.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((s) => s._id !== id));
      setMessage({ type: "success", text: "Supplier deleted successfully!" });
    } catch (error) {
      console.error("Error deleting supplier:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error deleting supplier.",
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Supplier Management</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Add Supplier Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />
        <input
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          required
        /><br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Add Supplier</button>
      </form>

      {/* Supplier List */}
      <h3>Existing Suppliers</h3>
      {loading ? (
        <p>Loading suppliers...</p>
      ) : suppliers.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.contact}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>
                  <button onClick={() => deleteSupplier(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No suppliers found.</p>
      )}
    </div>
  );
}

export default Suppliers;