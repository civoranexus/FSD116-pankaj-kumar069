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
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        🌱 Place Order
      </h2>

      {message.text && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "16px",
            color: message.type === "error" ? "#d32f2f" : "#2e7d32",
            fontWeight: "500",
          }}
        >
          {message.text}
        </p>
      )}

      {inventory.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No products available
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {inventory.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #e0e0e0",
                padding: "18px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div>
                <h3 style={{ marginBottom: "8px" }}>{p.name}</h3>
                <p style={{ margin: "4px 0", fontWeight: "500" }}>
                  ₹{p.price}
                </p>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  Stock: {p.quantity}
                </p>
              </div>

              <button
                onClick={() => addToCart(p)}
                style={{
                  marginTop: "14px",
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#43a047")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#4CAF50")
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaceOrder;
