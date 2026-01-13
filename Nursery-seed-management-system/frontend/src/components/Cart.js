import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleQuantityChange = (id, newQty) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0)
    return <h2>Your cart is empty. Go back to <button onClick={() => navigate("/seeds")}>Seeds</button></h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>
          <p>
            Quantity:{" "}
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
            />
          </p>
          <p>Subtotal: ₹{item.price * item.quantity}</p>
          <button onClick={() => handleRemove(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{totalPrice}</h3>
      <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
