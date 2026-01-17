import React, { useState, useEffect } from "react";
import API from "../../api";
import MonthlySalesChart from "../../components/MonthlySalesChart";
import TopCharts from "../../components/TopCharts";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      {/* Feedback messages */}
      {message.text && (
        <div
          className={
            message.type === "error"
              ? "bg-red-100 text-red-700 p-3 rounded mb-4"
              : "bg-green-100 text-green-700 p-3 rounded mb-4"
          }
        >
          {message.text}
        </div>
      )}

      {/* Sales Summary Cards */}
      {loadingReport ? (
        <p>Loading summary...</p>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{report.totalOrders}</div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Items Sold</div>
            <div className="text-2xl font-bold">{report.totalItemsSold}</div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="text-2xl font-bold">₹{report.totalRevenue}</div>
          </div>
        </div>
      ) : (
        <p>No sales data available for selected filters.</p>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Inventory */}
        <div className="lg:col-span-1 bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Inventory Overview</h3>

          {loadingData ? (
            <p>Loading inventory...</p>
          ) : inventory.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 5).map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No inventory records found.</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Showing first 5 items. (Full list can be added later)
          </p>
        </div>

        {/* Middle Column - Orders */}
        <div className="lg:col-span-2 bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Orders Overview</h3>

          {loadingData ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">{order._id}</td>
                    <td className="py-2">{order.customer?.name || "Unknown"}</td>
                    <td className="py-2">
                      {order.items.map((i, idx) => (
                        <div key={idx}>
                          {i.product?.name} x {i.quantity}
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

          <p className="text-xs text-gray-500 mt-2">
            Showing first 5 orders. (Full list can be added later)
          </p>
        </div>
      </div>

      {/* Sales Reports + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Monthly Sales */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Monthly Sales Chart</h3>
          <div className="mb-4">
            <label className="text-sm">Year:</label>
            <input
              type="number"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="ml-2 p-2 border rounded"
            />
          </div>
          <MonthlySalesChart year={filters.year} />
        </div>

        {/* Filters + Top Charts */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Filters & Top Charts</h3>

          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm">
              Start Date:
              <input
                type="date"
                value={filters.start}
                onChange={(e) => setFilters({ ...filters, start: e.target.value })}
                className="ml-2 p-2 border rounded"
              />
            </label>

            <label className="text-sm">
              End Date:
              <input
                type="date"
                value={filters.end}
                onChange={(e) => setFilters({ ...filters, end: e.target.value })}
                className="ml-2 p-2 border rounded"
              />
            </label>

            <label className="text-sm">
              Supplier:
              <select
                value={filters.supplierId}
                onChange={(e) => setFilters({ ...filters, supplierId: e.target.value })}
                className="ml-2 p-2 border rounded"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              Product:
              <select
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                className="ml-2 p-2 border rounded"
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

          <div className="mt-4">
            <TopCharts
              start={filters.start}
              end={filters.end}
              supplierId={filters.supplierId}
              productId={filters.productId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
