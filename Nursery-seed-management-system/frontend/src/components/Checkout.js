import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Pre-fill user info if logged in
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!address) return alert("Please enter shipping address");

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      setLoading(true);

      // Prepare order items for backend
      const orderItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      // Call backend API
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          customer: JSON.parse(localStorage.getItem("userInfo"))._id, // current logged-in user
          items: orderItems,
          totalAmount: totalPrice,
          shippingAddress: address // optional if backend supports
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart"); // empty cart
      navigate("/my-orders");          // go to MyOrders page
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error placing order");
      setLoading(false);
    }
  };

  if (cart.length === 0) return <h2 style={{ padding: "20px" }}>Your cart is empty.</h2>;

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
