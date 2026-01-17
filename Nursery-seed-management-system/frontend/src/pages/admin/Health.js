import React, { useState, useEffect } from "react";
import API from "../../api";

function Health() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    batchId: "",
    plantName: "",
    status: "Healthy",
    notes: "",
    treatment: "",
    checkDate: "",
    doctorName: "",
    treatmentCost: "",
    nextCheckDate: "",
    severity: "Low",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await API.post("/health", form);
      setRecords([...records, res.data.record]);
      setForm({
        batchId: "",
        plantName: "",
        status: "Healthy",
        notes: "",
        treatment: "",
        checkDate: "",
        doctorName: "",
        treatmentCost: "",
        nextCheckDate: "",
        severity: "Low",
      });
      setMessage({ type: "success", text: "Health record added successfully!" });
    } catch (error) {
      console.error("Error adding health record:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding health record.",
      });
    }
  };

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

  // ✅ Styles
  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  };

  const thStyle = { padding: "10px", borderBottom: "1px solid #ccc", background: "#f0f0f0" };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "center" };

  const statusColor = (status) => {
    switch (status) {
      case "Healthy": return "#4CAF50";
      case "Under Treatment": return "#FF9800";
      case "Ready for Sale": return "#2196F3";
      default: return "#9E9E9E";
    }
  };

  const severityColor = (severity) => {
    switch (severity) {
      case "Low": return "#4CAF50";
      case "Medium": return "#FFC107";
      case "High": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Plant Health Tracking</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{
          color: message.type === "error" ? "#f44336" : "#4CAF50",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
        }}>{message.text}</p>
      )}

      {/* Add Health Record Form */}
      <form onSubmit={handleSubmit} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px",
      }}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required style={inputStyle} />
        <input name="plantName" placeholder="Plant Name" value={form.plantName} onChange={handleChange} required style={inputStyle} />
        <input type="date" name="checkDate" value={form.checkDate} onChange={handleChange} required style={inputStyle} />
        <input name="doctorName" placeholder="Checked By" value={form.doctorName} onChange={handleChange} style={inputStyle} />
        <input type="number" name="treatmentCost" placeholder="Treatment Cost (₹)" value={form.treatmentCost} onChange={handleChange} style={inputStyle} />
        <input type="date" name="nextCheckDate" value={form.nextCheckDate} onChange={handleChange} style={inputStyle} />

        <select name="severity" value={form.severity} onChange={handleChange} style={inputStyle}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="Healthy">Healthy</option>
          <option value="Under Treatment">Under Treatment</option>
          <option value="Ready for Sale">Ready for Sale</option>
        </select>

        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} style={inputStyle} />
        <input name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} style={inputStyle} />

        <button type="submit" style={{
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
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}>
          Add Health Record
        </button>
      </form>

      {/* Health Records Table */}
      <h3 style={{ marginBottom: "15px" }}>Existing Health Records</h3>
      <div style={{
        overflowX: "auto",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading health records...</p>
        ) : records.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Batch ID</th>
                <th style={thStyle}>Plant Name</th>
                <th style={thStyle}>Check Date</th>
                <th style={thStyle}>Checked By</th>
                <th style={thStyle}>Treatment Cost</th>
                <th style={thStyle}>Next Check Date</th>
                <th style={thStyle}>Severity</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Treatment</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td style={tdStyle}>{r.batchId}</td>
                  <td style={tdStyle}>{r.plantName}</td>
                  <td style={tdStyle}>{r.checkDate || "N/A"}</td>
                  <td style={tdStyle}>{r.doctorName || "N/A"}</td>
                  <td style={tdStyle}>{r.treatmentCost || "0"}</td>
                  <td style={tdStyle}>{r.nextCheckDate || "N/A"}</td>
                  <td style={{...tdStyle, color: "#fff", fontWeight: "bold", backgroundColor: severityColor(r.severity), borderRadius: "6px"}}>{r.severity}</td>
                  <td style={{...tdStyle, color: "#fff", fontWeight: "bold", backgroundColor: statusColor(r.status), borderRadius: "6px"}}>{r.status}</td>
                  <td style={tdStyle}>{r.notes || "None"}</td>
                  <td style={tdStyle}>{r.treatment || "None"}</td>
                  <td style={tdStyle}>
                    <select value={r.status} onChange={(e) => handleUpdate(r._id, e.target.value)} style={inputStyle}>
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
          <p style={{ textAlign: "center" }}>No health records found.</p>
        )}
      </div>

      {/* ✅ Original code preserved */}
      {/*
      Original form:
      <form onSubmit={handleSubmit}> ... </form>

      Original table:
      <table border="1" cellPadding="5"> ... </table>
      */}
    </div>
  );
}

export default Health;
