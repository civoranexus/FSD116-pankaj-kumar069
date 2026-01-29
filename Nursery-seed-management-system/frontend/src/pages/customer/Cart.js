import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/* NEW: Professional UX/UI */
import "../../styles/customer/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h2>🛒 Your cart is empty</h2>
        <p className="cart-empty-text">
          Add seeds to your cart to start ordering.
        </p>
        <button
          onClick={() => navigate("/seeds")}
          className="cart-empty-btn"
        >
          Browse Seeds
        </button>

        {/* ❌ OLD INLINE STYLE (REMOVED)
        <div style={{ padding: "20px" }}></div>
        */}
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>🛒 My Cart</h2>

      {/* CART ITEMS */}
      <div className="cart-items-grid">
        {cart.map((item) => (
          <div key={item._id} className="cart-item-card">
            {/* PRODUCT IMAGE */}
            <div className="cart-item-img">
              <img
                src={item.image || "https://via.placeholder.com/100"}
                alt={item.name}
              />
            </div>

            {/* DETAILS */}
            <div className="cart-item-details">
              <p className="cart-item-title">{item.name}</p>
              <p className="cart-item-price">Price: ₹{item.price}</p>

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

              <p className="cart-item-subtotal">
                Subtotal: ₹{item.price * item.quantity}
              </p>

              <button
                className="cart-remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                ❌ Remove
              </button>
            </div>

            {/* ❌ OLD INLINE STYLE (COMMENTED)
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}></div>
            */}
          </div>
        ))}
      </div>

      {/* SUMMARY BAR */}
      <div className="cart-summary-bar">
        <span className="summary-total">Total: ₹{totalPrice}</span>

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
      <button onClick={() => navigate("/checkout")} style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer" }}>Proceed to Checkout</button>
      <button onClick={() => clearCart()} style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer", marginLeft: "10px" }}>Clear Cart</button>
      */}
    </div>
  );
};

export default Cart;
