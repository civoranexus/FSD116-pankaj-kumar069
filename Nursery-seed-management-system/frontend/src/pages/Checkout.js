import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import API from "../api";

const Checkout = () => {
  const navigate = useNavigate();

  // ✅ Use cart from context
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  // total price
  const totalPrice = cart.reduce(
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
      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await API.post(
        "/orders",
        {
          items: orderItems,
          totalAmount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/my-orders");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error placing order");
      setLoading(false);
    }
  };

  if (cart.length === 0)
    return <h2 style={{ padding: "20px" }}>Your cart is empty.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      <h3>Total: ₹{totalPrice}</h3>

      <div style={{ margin: "10px 0" }}>
        <label>
          Name: <input type="text" name="name" />
        </label>
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          Email: <input type="email" name="email"  />
        </label>
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          Shipping Address:
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
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
