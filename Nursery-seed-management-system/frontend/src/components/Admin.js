import React, { useState, useEffect } from "react";
import API from "../api";
import MonthlySalesChart from "./MonthlySalesChart";
import TopCharts from "./TopCharts";

function Admin() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get("/sales/report?start=2026-01-01&end=2026-12-31");
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };
    fetchReport();
  }, []);





  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await API.get("/inventory");
        setInventory(invRes.data);

        const ordRes = await API.get("/orders");
        setOrders(ordRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      {report ? (
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <div className="card">Total Orders: {report.totalOrders}</div>
          <div className="card">Items Sold: {report.totalItemsSold}</div>
          <div className="card">Revenue: ₹{report.totalRevenue}</div>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}


      {/* Inventory Overview */}
      <h3>Inventory Overview</h3>
      <table border="1" cellPadding="5">
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

      {/* Orders Overview */}
      <h3 style={{ marginTop: "2rem" }}>Orders Overview</h3>
      <table border="1" cellPadding="5">
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
              <td>{order.customer?.name}</td>
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

      {/* Sales Reports */}
      <h3 style={{ marginTop: "2rem" }}>Sales Reports</h3>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "400px" }}>
          <MonthlySalesChart year={2026} />
        </div>
        <div style={{ flex: 1, minWidth: "400px" }}>
          <TopCharts start="2026-01-01" end="2026-12-31" />
        </div>
      </div>
    </div>
  );
}

export default Admin;