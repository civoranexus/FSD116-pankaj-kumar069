import React, { useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/* ✅ NEW: Customer Checkout UX styles */
import "../../styles/customer/checkout.css";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  /* ===============================
     NEW: STEP STATE (UX ONLY)
  =============================== */
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm

  const [message, setMessage] = useState("");

  // 🔥 Total price (NO CHANGE)
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /* ===============================
     CHECKOUT API CALL (NO CHANGE)
  =============================== */
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
    <div className="checkout-page">
      <h2>Checkout</h2>

      {/* ===============================
          STEP INDICATOR
      =============================== */}
      <div className="checkout-steps">
        <div className={`checkout-step ${step === 1 ? "active" : ""}`}>
          Address
        </div>
        <div className={`checkout-step ${step === 2 ? "active" : ""}`}>
          Payment
        </div>
        <div className={`checkout-step ${step === 3 ? "active" : ""}`}>
          Confirm
        </div>
      </div>

      {/* ===============================
          MESSAGE (SUCCESS / ERROR)
      =============================== */}
      {message && (
        <p
          style={{
            color: message.includes("success") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      {/* ===============================
          STEP 1: ADDRESS
      =============================== */}
      {step === 1 && (
        <div className="checkout-card">
          <label>Delivery Address</label>
          <textarea
            placeholder="Enter your full delivery address"
            rows="4"
          />

          <div className="checkout-actions">
            <button
              className="next-btn"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ===============================
          STEP 2: PAYMENT
      =============================== */}
      {step === 2 && (
        <div className="checkout-card">
          <p><b>Payment Method</b></p>

          <p>
            <input type="radio" checked readOnly /> Cash on Delivery
          </p>

          <div className="checkout-actions">
            <button
              className="back-btn"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="next-btn"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ===============================
          STEP 3: CONFIRM
      =============================== */}
      {step === 3 && (
        <div className="checkout-card">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item._id} style={{ marginBottom: "8px" }}>
              {item.name} × {item.quantity} = ₹
              {item.price * item.quantity}
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <div className="checkout-actions">
            <button
              className="back-btn"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="next-btn"
              onClick={handleCheckout}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* ❌ OLD SIMPLE UI (COMMENTED – replaced with step-wise UX)
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
      */}
    </div>
  );
}

export default Checkout;
