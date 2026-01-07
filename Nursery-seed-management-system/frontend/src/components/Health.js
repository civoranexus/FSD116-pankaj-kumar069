import React, { useState, useEffect } from "react";
import API from "../api";

function Health() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    batchId: "",
    plantName: "",
    status: "Healthy",
    notes: "",
    treatment: ""
  });

  // Fetch health records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await API.get("/health");
        setRecords(res.data);
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };
    fetchRecords();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new health record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/health", form);
      alert("Health record added successfully!");
      setRecords([...records, res.data.record]);
      setForm({ batchId: "", plantName: "", status: "Healthy", notes: "", treatment: "" });
    } catch (error) {
      console.error("Error adding health record:", error.response?.data || error.message);
      alert("Error adding health record: " + (error.response?.data?.message || error.message));
    }
  };

  // Update health record status
  const handleUpdate = async (id, newStatus) => {
    try {
      const res = await API.put(`/health/${id}`, { status: newStatus });
      setRecords(records.map(r => r._id === id ? res.data.record : r));
    } catch (error) {
      console.error("Error updating health record:", error.response?.data || error.message);
      alert("Error updating health record: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Health Tracking</h2>

      {/* Add Health Record Form */}
      <form onSubmit={handleSubmit}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} /><br/>
        <input name="plantName" placeholder="Plant Name" value={form.plantName} onChange={handleChange} /><br/>
        
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Healthy">Healthy</option>
          <option value="Under Treatment">Under Treatment</option>
          <option value="Ready for Sale">Ready for Sale</option>
        </select><br/>

        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} /><br/>
        <input name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} /><br/>
        
        <button type="submit">Add Health Record</button>
      </form>

      {/* Health Records List */}
      <h3>Health Records</h3>
      <ul>
        {records.map((r) => (
          <li key={r._id}>
            Batch: {r.batchId} — Plant: {r.plantName} — Status: {r.status} — Notes: {r.notes || "None"} — Treatment: {r.treatment || "None"}
            <button onClick={() => handleUpdate(r._id, "Healthy")}>Mark Healthy</button>
            <button onClick={() => handleUpdate(r._id, "Under Treatment")}>Mark Under Treatment</button>
            <button onClick={() => handleUpdate(r._id, "Ready for Sale")}>Mark Ready for Sale</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Health;