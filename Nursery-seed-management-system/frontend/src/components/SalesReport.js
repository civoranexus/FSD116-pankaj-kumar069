import React, { useState, useEffect } from "react";
import API from "../api";

function SalesReport() {
  const [report, setReport] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchReport = async () => {
    try {
      const res = await API.get("/sales/report", { params: { start, end } });
      setReport(res.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  });

  if (!report) return <p>Loading sales report...</p>;

  return (
    <div>
      <h2>Sales Report</h2>

      {/* Date Filters */}
      <label>Start Date: </label>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      <label>End Date: </label>
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      <button onClick={fetchReport}>Filter Report</button>

      <p><strong>Total Orders:</strong> {report.totalOrders}</p>
      <p><strong>Total Items Sold:</strong> {report.totalItemsSold}</p>
      <p><strong>Total Revenue:</strong> ₹{report.totalRevenue}</p>

      <h3>Top Selling Products</h3>
      <ul>
        {report.topProducts.map((p, idx) => (
          <li key={idx}>
            {p.name} — {p.quantitySold} units — Revenue: ₹{p.revenue}
          </li>
        ))}
      </ul>

      <h3>Top Suppliers (by Revenue)</h3>
      <ul>
        {report.topSuppliers.map((s, idx) => (
          <li key={idx}>
            {s.name} — {s.quantitySold} units — Revenue: ₹{s.revenue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalesReport;