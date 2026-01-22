import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/orderService";
import Loader from "../../components/common/Loader";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setMessage("");

      const orderData = {
        items: cartItems,
        totalAmount,
      };

      await placeOrder(orderData);

      clearCart();
      setMessage("✅ Order placed successfully!");
    } catch (error) {
      setMessage("❌ Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p><b>Total Items:</b> {cartItems.length}</p>
          <p><b>Total Amount:</b> ₹{totalAmount}</p>

          {/* ❌ Address / Payment future scope */}
          {/* <AddressForm /> */}
          {/* <PaymentGateway /> */}

          <button onClick={handlePlaceOrder}>
            Place Order
          </button>

          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
};

export default Checkout;
