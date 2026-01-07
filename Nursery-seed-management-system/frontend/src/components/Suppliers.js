import React, { useState, useEffect } from "react";
import API from "../api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await API.get("/suppliers");
        setSuppliers(res.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
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
    try {
      const res = await API.post("/suppliers", form);
      alert("Supplier added successfully!");
      setSuppliers([...suppliers, res.data.supplier]);
      setForm({ name: "", contact: "", email: "", address: "" });
    } catch (error) {
      console.error("Error adding supplier:", error.response?.data || error.message);
      alert("Error adding supplier: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Supplier Management</h2>

      {/* Add Supplier Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br/>
        <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} /><br/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} /><br/>
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} /><br/>
        <button type="submit">Add Supplier</button>
      </form>

      {/* Supplier List */}
      <h3>Existing Suppliers</h3>
      <ul>
        {suppliers.map((s) => (
          <li key={s._id}>
            {s.name} — {s.contact} — {s.email} — {s.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Suppliers;