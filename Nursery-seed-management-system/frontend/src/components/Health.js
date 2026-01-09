import React, { useState, useEffect } from "react";
import API from "../api";

function Health() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    batchId: "",
    plantName: "",
    status: "Healthy",
    notes: "",
    treatment: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch health records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await API.get("/health");
        setRecords(res.data);
      } catch (error) {
        console.error("Error fetching health records:", error);
        setMessage({ type: "error", text: "Failed to load health records." });
      } finally {
        setLoading(false);
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
    setMessage({ type: "", text: "" });

    try {
      const res = await API.post("/health", form);
      setRecords([...records, res.data.record]);
      setForm({ batchId: "", plantName: "", status: "Healthy", notes: "", treatment: "" });
      setMessage({ type: "success", text: "Health record added successfully!" });
    } catch (error) {
      console.error("Error adding health record:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding health record.",
      });
    }
  };

  // Update health record status
  const handleUpdate = async (id, newStatus) => {
    try {
      const res = await API.put(`/health/${id}`, { status: newStatus });
      setRecords(records.map((r) => (r._id === id ? res.data.record : r)));
      setMessage({ type: "success", text: "Health record updated!" });
    } catch (error) {
      console.error("Error updating health record:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error updating health record.",
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Health Tracking</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Add Health Record Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="batchId"
          placeholder="Batch ID"
          value={form.batchId}
          onChange={handleChange}
          required
        /><br />
        <input
          name="plantName"
          placeholder="Plant Name"
          value={form.plantName}
          onChange={handleChange}
          required
        /><br />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Healthy">Healthy</option>
          <option value="Under Treatment">Under Treatment</option>
          <option value="Ready for Sale">Ready for Sale</option>
        </select><br />

        <input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        /><br />
        <input
          name="treatment"
          placeholder="Treatment"
          value={form.treatment}
          onChange={handleChange}
        /><br />

        <button type="submit">Add Health Record</button>
      </form>

      {/* Health Records List */}
      <h3>Health Records</h3>
      {loading ? (
        <p>Loading health records...</p>
      ) : records.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Plant Name</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Treatment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.batchId}</td>
                <td>{r.plantName}</td>
                <td>{r.status}</td>
                <td>{r.notes || "None"}</td>
                <td>{r.treatment || "None"}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) => handleUpdate(r._id, e.target.value)}
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Ready for Sale">Ready for Sale</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No health records found.</p>
      )}
    </div>
  );
}

export default Health;