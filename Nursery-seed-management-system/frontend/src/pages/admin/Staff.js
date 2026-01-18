import React, { useState, useEffect } from "react";
import API from "../../api";

// Staff Dashboard Page
function Staff() {
  const [inventory, setInventory] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  // Fetch staff data (inventory + procurements + suppliers)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invRes = await API.get("/inventory");

        // Agar response me direct array hai:
        // setInventory(invRes.data);
        // Agar response me { inventory: [] } format hai:
        setInventory(invRes.data.inventory || invRes.data || []);

        const procRes = await API.get("/procurements");

        // Agar response me direct array hai:
        // setProcurements(procRes.data);
        // Agar response me { procurements: [] } format hai:
        setProcurements(procRes.data.procurements || procRes.data || []);

        const supRes = await API.get("/suppliers");

        // Agar response me direct array hai:
        // setSuppliers(supRes.data);
        // Agar response me { suppliers: [] } format hai:
        setSuppliers(supRes.data.suppliers || supRes.data || []);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setMessage({ type: "error", text: "Failed to load staff data." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Staff Dashboard</h2>

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="text-sm text-gray-500">Total Inventory Items</div>
          <div className="text-2xl font-bold">{inventory.length}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-sm text-gray-500">Total Procurements</div>
          <div className="text-2xl font-bold">{procurements.length}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-sm text-gray-500">Total Suppliers</div>
          <div className="text-2xl font-bold">{suppliers.length}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-xl font-semibold mb-3">Inventory Overview</h3>

        {loading ? (
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
              {inventory.map((item) => (
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
      </div>

      {/* Procurements Table */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-xl font-semibold mb-3">Procurements</h3>

        {loading ? (
          <p>Loading procurements...</p>
        ) : procurements.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Procurement ID</th>
                <th className="py-2">Supplier</th>
                <th className="py-2">Items</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {procurements.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2">{p._id}</td>
                  <td className="py-2">{p.supplier?.name || "Unknown"}</td>
                  <td className="py-2">
                    {/* p.items may be undefined so we use optional chaining */}
                    {p.items?.map((i, idx) => (
                      <div key={idx}>
                        {i.product?.name} x {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No procurements found.</p>
        )}
      </div>

      {/* Suppliers List */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Suppliers</h3>

        {loading ? (
          <p>Loading suppliers...</p>
        ) : suppliers.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Supplier Name</th>
                <th className="py-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.contact || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No suppliers found.</p>
        )}
      </div>
    </div>
  );
}

export default Staff;
