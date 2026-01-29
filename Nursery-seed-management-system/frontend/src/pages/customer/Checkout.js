import React, { useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/* NEW: Customer Checkout UX styles */
import "../../styles/customer/checkout.css";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
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
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>🛒 Checkout</h2>

      {/* STEP INDICATOR */}
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

      {/* MESSAGE */}
      {message && (
        <p className={`checkout-message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      {/* ======================
          STEP 1: ADDRESS
      ====================== */}
      {step === 1 && (
        <div className="checkout-card">
          <label>Delivery Address</label>
          <textarea placeholder="Enter your full delivery address" rows="4" />

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
          <p><b>Payment Method</b></p>

          <div className="payment-option">
            <input type="radio" checked readOnly /> Cash on Delivery
          </div>

          <div className="checkout-actions">
            <button className="back-btn" onClick={() => setStep(1)}>Back</button>
            <button className="next-btn" onClick={() => setStep(3)}>Next</button>
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
                  <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} />
                  <div>
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
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
            <button className="back-btn" onClick={() => setStep(2)}>Back</button>
            <button className="next-btn" onClick={handleCheckout}>Place Order</button>
          </div>
        </div>
      )}

      {/* ❌ OLD SIMPLE UI (COMMENTED)
      <div style={{ padding: "20px" }}>
        <h2>Checkout</h2>
        {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
        <div>
          {cart.map((item) => <div key={item._id}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</div>)}
        </div>
        <h3>Total: ₹{totalPrice}</h3>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
      */}
    </div>
  );
}

export default Checkout;
