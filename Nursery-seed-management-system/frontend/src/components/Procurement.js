import React, { useState, useEffect } from "react";
import API from "../api";

function Procurement() {
  const [procurements, setProcurements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    supplier: "",
    productName: "",   // ✅ use productName consistently
    quantity: "",
    cost: ""
  });

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
    try {
      const payload = {
        supplier: form.supplier,
        productName: form.productName,   // ✅ now matches state
        quantity: Number(form.quantity),
        cost: Number(form.cost)
      };
      const res = await API.post("/procurements", payload);
      alert("Procurement recorded successfully!");
      setProcurements([...procurements, res.data.procurement]);
      setForm({ supplier: "", productName: "", quantity: "", cost: "" });
    } catch (error) {
      console.error("Error adding procurement:", error.response?.data || error.message);
      alert("Error adding procurement: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Procurement Tracking</h2>

      {/* Add Procurement Form */}
      <form onSubmit={handleSubmit}>
        <select name="supplier" value={form.supplier} onChange={handleChange}>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select><br />

        <select name="productName" value={form.productName} onChange={handleChange}>
          <option value="">Select Product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.type})
            </option>
          ))}
        </select><br />

        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} /><br />
        <input name="cost" type="number" placeholder="Cost" value={form.cost} onChange={handleChange} /><br />
        <button type="submit">Record Procurement</button>
      </form>

      {/* Procurement List */}
      <h3>Procurement Records</h3>
      <ul>
        {procurements.map((p) => (
          <li key={p._id}>
            Supplier: {p.supplier?.name} —
            Product: {p.productName?.name} —
            Qty: {p.quantity} —
            Cost: ₹{p.cost}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Procurement;