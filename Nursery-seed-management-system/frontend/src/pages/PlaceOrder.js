import React, { useEffect, useState, useContext } from "react";
import API from "../api";

/* ❌ OLD
import { CartContext } from "../context/CartContext";
*/

/* ✅ NEW: use custom hook */
import { useCart } from "../context/CartContext";

function PlaceOrder() {
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  /* ❌ OLD
  const { addToCart } = useContext(CartContext);
  */

  /* ✅ NEW */
  const { addToCart } = useCart();

  /* =====================================================
     FETCH INVENTORY
  ===================================================== */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);

        const res = await API.get("/inventory");

        /* ❌ OLD
        setInventory(res.data.inventory || res.data || []);
        */

        /* ✅ NEW: safer response handling */
        const products =
          res?.data?.inventory || res?.data || [];

        setInventory(products);
      } catch (err) {
        console.error(err);
        setMessage({
          type: "error",
          text: "Failed to load products.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  /* =====================================================
     HANDLE ADD TO CART
  ===================================================== */
  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      setMessage({
        type: "error",
        text: "Out of stock",
      });
      return;
    }

    addToCart(product);

    /* ✅ UX feedback */
    setMessage({
      type: "success",
      text: `${product.name} added to cart`,
    });

    /* Auto clear message */
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 1500);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        🌱 Place Order
      </h2>

      {/* ================= MESSAGE ================= */}
      {message.text && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "16px",
            color:
              message.type === "error"
                ? "#d32f2f"
                : "#2e7d32",
            fontWeight: "500",
          }}
        >
          {message.text}
        </p>
      )}

      {/* ================= LOADING ================= */}
      {loading && (
        <p style={{ textAlign: "center", color: "#555" }}>
          Loading products...
        </p>
      )}

      {/* ================= INVENTORY ================= */}
      {!loading && inventory.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No products available
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
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
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div>
                <h3 style={{ marginBottom: "8px" }}>
                  {p.name}
                </h3>
                <p style={{ margin: "4px 0", fontWeight: "500" }}>
                  ₹{p.price}
                </p>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  Stock: {p.quantity}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(p)}
                disabled={p.quantity <= 0}
                style={{
                  marginTop: "14px",
                  padding: "10px",
                  backgroundColor:
                    p.quantity <= 0
                      ? "#9e9e9e"
                      : "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    p.quantity <= 0
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "600",
                  transition:
                    "background-color 0.3s ease",
                }}
              >
                {p.quantity <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaceOrder;
