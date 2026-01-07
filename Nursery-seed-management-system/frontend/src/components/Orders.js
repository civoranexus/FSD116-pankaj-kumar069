import React, { useState, useEffect } from "react";
import API from "../api";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    product: "",
    quantity: ""
  });

  // Fetch inventory + orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await API.get("/inventory");
        setInventory(invRes.data);

        const ordRes = await API.get("/orders");
        setOrders(ordRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Place new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customer: form.customer, // customer ID
        items: [
          { product: form.product, quantity: Number(form.quantity) }
        ]
      };
      const res = await API.post("/orders", payload);
      alert("Order placed successfully!");
      setOrders([...orders, res.data.order]);
      setForm({ customer: "", product: "", quantity: "" });
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Error placing order: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await API.get("/customers");
      setCustomers(res.data);
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      {/* Place Order Form */}
      <form onSubmit={handleSubmit}>
        <select name="customer" value={form.customer} onChange={handleChange}>
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <br />

        <select name="product" value={form.product} onChange={handleChange}>
          <option value="">Select Product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.type}) - {item.quantity} available
            </option>
          ))}
        </select><br />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        /><br />

        <button type="submit">Place Order</button>
      </form>

      {/* Orders List */}
      <h3>Existing Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order #{order._id} — Customer: {order.customer?.name} ({order.customer?.email}) — 
            Items:
            <ul>
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.product?.name} ({i.product?.type}) — Qty: {i.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;