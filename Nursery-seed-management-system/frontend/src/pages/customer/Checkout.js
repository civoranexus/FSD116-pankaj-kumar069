import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   API & CONTEXT IMPORTS
========================= */
// ❌ OLD (when Checkout was inside /pages)
// import API from "../api";
// import { useCart } from "../context/CartContext";

// ✅ NEW (Checkout moved to /pages/customer)
import API from "../../api";
import { useCart } from "../../context/CartContext";

/* =========================
   STYLES
========================= */
import "../../styles/customer/checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  /* =========================
     LOCAL STATES
  ========================= */
  const [step, setStep] = useState(1); // 1: Address → 2: Payment → 3: Confirm
  const [message, setMessage] = useState("");

  /* =========================
     CALCULATIONS
  ========================= */
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* =========================
     PLACE ORDER HANDLER
  ========================= */
  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const payload = {
        customer: userId,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      };

      await API.post("/orders", payload);

      setMessage("Order placed successfully!");
      clearCart();

      // Redirect after success
      setTimeout(() => {
        navigate("/my-orders");
      }, 1200);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Checkout failed. Please try again."
      );
    }
  };

  return (
    <div className="checkout-page">
      <h2>🛒 Checkout</h2>

      {/* ======================
          STEP INDICATOR
      ====================== */}
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

      {/* ======================
          STATUS MESSAGE
      ====================== */}
      {message && (
        <p
          className={`checkout-message ${
            message.toLowerCase().includes("success") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}

      {/* ======================
          STEP 1: ADDRESS
      ====================== */}
      {step === 1 && (
        <div className="checkout-card">
          <label>Delivery Address</label>
          <textarea
            placeholder="Enter your full delivery address"
            rows="4"
          />

          <div className="checkout-actions">
            <button className="next-btn" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* ======================
          STEP 2: PAYMENT
      ====================== */}
      {step === 2 && (
        <div className="checkout-card">
          <p>
            <b>Payment Method</b>
          </p>

          <div className="payment-option">
            <input type="radio" checked readOnly />
            <span> Cash on Delivery</span>
          </div>

          <div className="checkout-actions">
            <button className="back-btn" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="next-btn" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* ======================
          STEP 3: CONFIRM ORDER
      ====================== */}
      {step === 3 && (
        <div className="checkout-card">
          <h3>Order Summary</h3>

          <div className="order-items-summary">
            {cart.map((item) => (
              <div key={item._id} className="checkout-item-card">
                <div className="checkout-item-left">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                  />
                  <div>
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="checkout-item-price">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <h3 className="checkout-total">Total: ₹{totalPrice}</h3>

          <div className="checkout-actions">
            <button className="back-btn" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="next-btn" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* ======================
          ❌ OLD BASIC CHECKOUT UI
          (Kept for reference)
      ====================== */}
      {/*
      <div style={{ padding: "20px" }}>
        <h2>Checkout</h2>
        {message && (
          <p style={{ color: message.includes("success") ? "green" : "red" }}>
            {message}
          </p>
        )}
        <div>
          {cart.map((item) => (
            <div key={item._id}>
              {item.name} x {item.quantity} = ₹
              {item.price * item.quantity}
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
