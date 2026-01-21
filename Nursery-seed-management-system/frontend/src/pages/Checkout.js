import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ❌ OLD (REMOVE)  ---> axios
// import axios from "axios";

// ✅ NEW
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  // ✅ NEW CART CONTEXT
  const { state, dispatch } = useCart();

  // ❌ OLD (REMOVE)
  // const [cart, setCart] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ NEW: Cart from context
    // setCart(storedCart);

    // Pre-fill user info if logged in
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  // ✅ NEW: total from cart context
  const totalPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address) return alert("Please enter shipping address");

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      setLoading(true);

      // Prepare order items for backend
      const orderItems = state.cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      // ✅ NEW: Using service (not axios)
      await placeOrder({
        items: orderItems,
        totalAmount: totalPrice,
        shippingAddress: address,
      });

      alert("✅ Order placed successfully!");

      // ✅ NEW: clear cart via context
      dispatch({ type: "CLEAR_CART" });

      navigate("/my-orders");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error placing order");
      setLoading(false);
    }
  };

  // ❌ OLD: cart.length
  // if (cart.length === 0) return <h2 style={{ padding: "20px" }}>Your cart is empty.</h2>;

  // ✅ NEW: cartItems length
  if (state.cartItems.length === 0)
    return <h2 style={{ padding: "20px" }}>Your cart is empty.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      <h3>Total: ₹{totalPrice}</h3>

      <div style={{ margin: "10px 0" }}>
        <label>
          Name: <input type="text" value={name} readOnly />
        </label>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>
          Email: <input type="email" value={email} readOnly />
        </label>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>
          Shipping Address:{" "}
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
