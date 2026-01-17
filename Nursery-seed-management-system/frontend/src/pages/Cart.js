import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update quantity
  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove item
  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Empty cart
  if (cart.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🛒 Your cart is empty</h2>
        <button onClick={() => navigate("/seeds")}>
          Go to Seeds
        </button>
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
                handleQuantityChange(item._id, Number(e.target.value))
              }
              style={{ width: "60px" }}
            />
          </p>
          <p>Subtotal: ₹{item.price * item.quantity}</p>
          <button onClick={() => handleRemove(item._id)}>❌ Remove</button>
        </div>
      ))}

      <h3>Total: ₹{totalPrice}</h3>

      {/* ✅ Proceed to Checkout */}
      <button
        onClick={() => navigate("/checkout")}
        style={{ padding: "10px 15px", marginTop: "10px", cursor: "pointer" }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
