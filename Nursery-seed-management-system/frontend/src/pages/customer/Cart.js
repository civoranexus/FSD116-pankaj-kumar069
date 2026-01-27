import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/* ✅ NEW: Customer Cart UX styles */
import "../../styles/customer/cart.css";

const Cart = () => {
  const navigate = useNavigate();

  // ✅ Use cart from context (NO CHANGE)
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  // ✅ Total price calculation (NO CHANGE)
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ✅ Empty cart UX
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h2>🛒 Your cart is empty</h2>

        {/* ❌ OLD INLINE STYLE (REMOVED)
        <div style={{ padding: "20px" }}>
        */}

        <button
          onClick={() => navigate("/seeds")}
          className="cart-empty-btn"
        >
          Go to Seeds
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>

      {/* ========================
          CART ITEMS LIST
      ======================== */}
      {cart.map((item) => (
        <div
          key={item._id}
          className="cart-item"

          /* ❌ OLD INLINE STYLE (COMMENTED)
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
          */
        >
          {/* Product Image (optional safe fallback) */}
          <img
            src={item.image || "https://via.placeholder.com/100"}
            alt={item.name}
          />

          <div className="cart-item-details">
            <div className="cart-item-title">{item.name}</div>

            <div className="cart-item-price">
              Price: ₹{item.price}
            </div>

            {/* Quantity Input */}
            <div className="cart-item-qty">
              Quantity:
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQty(item._id, Number(e.target.value))
                }
              />
            </div>

            <div className="cart-item-subtotal">
              Subtotal: ₹{item.price * item.quantity}
            </div>

            <button
              className="cart-remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              ❌ Remove
            </button>
          </div>
        </div>
      ))}

      {/* ========================
          STICKY SUMMARY BAR
      ======================== */}
      <div className="cart-summary-bar">
        <span>Total: ₹{totalPrice}</span>

        <div className="cart-summary-actions">
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            className="clear-cart-btn"
            onClick={() => clearCart()}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* ❌ OLD BUTTON SECTION (COMMENTED)
      <h3>Total: ₹{totalPrice}</h3>

      <button
        onClick={() => navigate("/checkout")}
        style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer" }}
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => clearCart()}
        style={{
          padding: "10px 15px",
          marginTop: "10px",
          cursor: "pointer",
          marginLeft: "10px",
        }}
      >
        Clear Cart
      </button>
      */}
    </div>
  );
};

export default Cart;
