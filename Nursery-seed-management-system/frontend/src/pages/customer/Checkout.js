import React, { useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const payload = {
        customer: userId,
        items: cart.map((i) => ({
          product: i._id,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: totalPrice,
      };

      await API.post("/orders", payload);

      setMessage("Order placed successfully!");
      clearCart();

      setTimeout(() => {
        navigate("/my-orders");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {message && (
        <p style={{ color: message.includes("success") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <div>
        {cart.map((item) => (
          <div key={item._id} style={{ marginBottom: "10px" }}>
            {item.name} x {item.quantity} = ₹{item.price * item.quantity}
          </div>
        ))}
      </div>

      <h3>Total: ₹{totalPrice}</h3>

      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}

export default Checkout;
