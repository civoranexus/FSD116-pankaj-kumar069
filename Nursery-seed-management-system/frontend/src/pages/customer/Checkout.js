import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   API & CONTEXT IMPORTS
========================= */
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
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ Address state */
  const [address, setAddress] = useState("");

  /* ❌ OLD (future use ke liye comment)
  const paymentMethod = "COD";
  */

  /* =========================
     TOTAL CALCULATION (UI ONLY)
     ❗ Backend will calculate again
  ========================= */
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* =========================
     PLACE ORDER HANDLER
  ========================= */
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage("Cart is empty");
      return;
    }

    if (!address.trim()) {
      setMessage("Delivery address is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      /* ❌ OLD (unsafe – frontend user control)
      const userId = localStorage.getItem("userId");
      */

      /* ✅ FINAL SAFE PAYLOAD
         👉 customer = backend JWT se
         👉 totalAmount = backend calculate karega
      */
      const payload = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          // ❌ price frontend se mat bhejo (backend ignore karega)
        })),
        deliveryAddress: address,
        paymentMethod: "COD",
      };

      await API.post("/orders", payload);

      setMessage("Order placed successfully ✅");
      clearCart();

      // ✅ Direct redirect (no delay confusion)
      navigate("/my-orders");
    } catch (error) {
      console.error("Checkout Error:", error);
      setMessage(
        error?.response?.data?.message ||
          "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
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
          MESSAGE
      ====================== */}
      {message && (
        <p
          className={`checkout-message ${
            message.toLowerCase().includes("success")
              ? "success"
              : "error"
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
            rows="4"
            placeholder="Enter your full delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="checkout-actions">
            <button
              className="next-btn"
              onClick={() => setStep(2)}
              disabled={!address.trim()}
            >
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
          STEP 3: CONFIRM
      ====================== */}
      {step === 3 && (
        <div className="checkout-card">
          <h3>Order Summary</h3>

          <div className="order-items-summary">
            {cart.map((item) => (
              <div key={item._id} className="checkout-item-card">
                <div className="checkout-item-left">
                  <img
                    src={
                      item.image ||
                      "https://dummyimage.com/80x80/cccccc/000000&text=Item"
                    }
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
            <button
              className="next-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}

      {/* ======================
          ❌ OLD BASIC CHECKOUT
          (REFERENCE ONLY)
      ====================== */}
      {/*
      <div>
        <h2>Checkout</h2>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
      */}
    </div>
  );
}

export default Checkout;
