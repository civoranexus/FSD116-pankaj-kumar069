import React, { useEffect, useState } from "react";
import axios from "axios";

const SeedList = () => {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH SEEDS FROM BACKEND
  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/inventory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSeeds(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load seeds");
        setLoading(false);
      }
    };

    fetchSeeds();
  }, []);

  // ✅ ADD TO CART FUNCTION
  const addToCart = (seed) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item._id === seed._id);

    if (existingItem) {
      existingItem.quantity += 1; // increase quantity if already in cart
    } else {
      cart.push({
        _id: seed._id,
        name: seed.name,
        price: seed.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Seed added to cart");
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading seeds...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌱 Available Seeds</h2>

      {seeds.length === 0 ? (
        <p>No seeds available</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {seeds.map((seed) => (
            <div
              key={seed._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              <h3>{seed.name}</h3>
              <p>Category: {seed.category}</p>
              <p>Price: ₹{seed.price}</p>
              <p>Stock: {seed.quantity}</p>

              {/* ✅ ADD TO CART BUTTON */}
              <button onClick={() => addToCart(seed)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeedList;
