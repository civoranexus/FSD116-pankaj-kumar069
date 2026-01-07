import React, { useState, useEffect } from "react";
import API from "../api";

function Admin() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

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
    <div>
      <h2>Admin Dashboard</h2>

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
      <h3>Orders Overview</h3>
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
    </div>
  );
}

export default Admin;