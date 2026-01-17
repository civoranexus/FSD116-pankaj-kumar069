import React, { useState, useEffect } from "react";
import API from "../../api";

function SalesReport() {
  const [report, setReport] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchReport = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.get("/sales/report", { params: { start, end } });
      setReport(res.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
      setReport(null);
      setMessage({ type: "error", text: "Failed to load sales report." });
    } finally {
      setLoading(false);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sales Report</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Date Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start Date:
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          End Date:
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
        <button style={{ marginLeft: "1rem" }} onClick={fetchReport}>
          Filter Report
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <p>Loading sales report...</p>
      ) : report ? (
        <>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
            <div className="card">Total Orders: {report.totalOrders}</div>
            <div className="card">Items Sold: {report.totalItemsSold}</div>
            <div className="card">Revenue: ₹{report.totalRevenue}</div>
          </div>

          <h3>Top Selling Products</h3>
          {report.topProducts?.length > 0 ? (
            <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {report.topProducts.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name}</td>
                    <td>{p.quantitySold}</td>
                    <td>{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No product sales found for this period.</p>
          )}

          <h3 style={{ marginTop: "2rem" }}>Top Suppliers (by Revenue)</h3>
          {report.topSuppliers?.length > 0 ? (
            <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Units Supplied</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {report.topSuppliers.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.quantitySold}</td>
                    <td>{s.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No supplier sales found for this period.</p>
          )}
        </>
      ) : (
        <p>No report data available.</p>
      )}
    </div>
  );
}

export default SalesReport;
