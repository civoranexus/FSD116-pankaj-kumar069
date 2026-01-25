import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { CartContext } from "../context/CartContext";

function PlaceOrder() {
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await API.get("/inventory");
        setInventory(res.data.inventory || res.data || []);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load products." });
      }
    };
    fetchInventory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌱 Place Order (Products)</h2>

      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "15px" }}>
        {inventory.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p>Stock: {p.quantity}</p>

            <button
              onClick={() => addToCart(p)}
              style={{
                padding: "10px",
                background: "#2196F3",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceOrder;
