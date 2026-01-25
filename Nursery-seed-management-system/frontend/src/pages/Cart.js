import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  // ✅ Use cart from context
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🛒 Your cart is empty</h2>
        <button onClick={() => navigate("/seeds")}>Go to Seeds</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>

          <p>
            Quantity:{" "}
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQty(item._id, Number(e.target.value))
              }
              style={{ width: "60px" }}
            />
          </p>

          <p>Subtotal: ₹{item.price * item.quantity}</p>

          <button onClick={() => removeFromCart(item._id)}>
            ❌ Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{totalPrice}</h3>

      <button
        onClick={() => navigate("/checkout")}
        style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer" }}
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => clearCart()}
        style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer", marginLeft: "10px" }}
      >
        Clear Cart
      </button>
    </div>
  );
};

export default Cart;
