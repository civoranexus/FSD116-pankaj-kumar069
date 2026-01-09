import React, { useState, useEffect } from "react";
import API from "../api";
import MonthlySalesChart from "./MonthlySalesChart";
import TopCharts from "./TopCharts";

function Admin() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Filters state
  const [filters, setFilters] = useState({
    start: "2026-01-01",
    end: "2026-12-31",
    supplierId: "",
    productId: "",
    year: 2026,
  });

  // Fetch sales report (summary)
  useEffect(() => {
    const fetchReport = async () => {
      setLoadingReport(true);
      try {
        const res = await API.get("/sales/report", {
          params: {
            start: filters.start,
            end: filters.end,
            supplierId: filters.supplierId,
            productId: filters.productId,
          },
        });
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
        setReport(null);
        setMessage({ type: "error", text: "Failed to load sales report." });
      } finally {
        setLoadingReport(false);
      }
    };
    fetchReport();
  }, [filters.start, filters.end, filters.supplierId, filters.productId]);

  // Fetch inventory, orders, suppliers once
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const invRes = await API.get("/inventory");
        setInventory(invRes.data);

        const ordRes = await API.get("/orders");
        setOrders(ordRes.data);

        const supRes = await API.get("/suppliers");
        setSuppliers(supRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setMessage({ type: "error", text: "Failed to load admin data." });
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>

      {/* Feedback messages */}
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      {/* Sales Summary */}
      {loadingReport ? (
        <p>Loading summary...</p>
      ) : report ? (
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <div className="card">Total Orders: {report.totalOrders}</div>
          <div className="card">Items Sold: {report.totalItemsSold}</div>
          <div className="card">Revenue: ₹{report.totalRevenue}</div>
        </div>
      ) : (
        <p>No sales data available for selected filters.</p>
      )}

      {/* Inventory Overview */}
      <h3>Inventory Overview</h3>
      {loadingData ? (
        <p>Loading inventory...</p>
      ) : inventory.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Batch ID</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.batchId}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No inventory records found.</p>
      )}

      {/* Orders Overview */}
      <h3 style={{ marginTop: "2rem" }}>Orders Overview</h3>
      {loadingData ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customer?.name || "Unknown"}</td>
                <td>
                  {order.items.map((i, idx) => (
                    <div key={idx}>
                      Product: {i.product?.name} ({i.product?.type}), Qty: {i.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}

      {/* Sales Reports */}
      <h3 style={{ marginTop: "2rem" }}>Sales Reports</h3>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "400px" }}>
          {/* ✅ Year Filter */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Year:
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
            </label>
          </div>
          <MonthlySalesChart year={filters.year} />
        </div>
        <div style={{ flex: 1, minWidth: "400px" }}>
          {/* Filter Controls */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Start Date:
              <input
                type="date"
                value={filters.start}
                onChange={(e) => setFilters({ ...filters, start: e.target.value })}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={filters.end}
                onChange={(e) => setFilters({ ...filters, end: e.target.value })}
              />
            </label>
            <label>
              Supplier:
              <select
                value={filters.supplierId}
                onChange={(e) => setFilters({ ...filters, supplierId: e.target.value })}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Product:
              <select
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
              >
                <option value="">All Products</option>
                {inventory.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <TopCharts
            start={filters.start}
            end={filters.end}
            supplierId={filters.supplierId}
            productId={filters.productId}
          />
        </div>
      </div>
    </div>
  );
}

export default Admin;