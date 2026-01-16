import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Professional SeedList Component
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

  if (loading)
    return (
      <p style={{ padding: "20px", textAlign: "center", fontStyle: "italic" }}>
        Loading seeds...
      </p>
    );
  if (error)
    return (
      <p style={{ padding: "20px", color: "red", textAlign: "center" }}>
        {error}
      </p>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>🌱 Available Seeds</h2>

      {seeds.length === 0 ? (
        <p style={{ textAlign: "center" }}>No seeds available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {seeds.map((seed) => (
            <div
              key={seed._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "10px" }}>{seed.name}</h3>
                <p style={{ margin: "4px 0" }}>Category: {seed.category}</p>
                <p style={{ margin: "4px 0" }}>Price: ₹{seed.price}</p>
                <p style={{ margin: "4px 0" }}>Stock: {seed.quantity}</p>
              </div>

              {/* ✅ ADD TO CART BUTTON */}
              <button
                onClick={() => addToCart(seed)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Optional: Commented old code preserved */}
      {/*
      Original code:
      return (
        <div style={{ padding: "20px" }}>
          <h2>🌱 Available Seeds</h2>
          {seeds.length === 0 ? (
            <p>No seeds available</p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {seeds.map((seed) => (
                <div key={seed._id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
                  <h3>{seed.name}</h3>
                  <p>Category: {seed.category}</p>
                  <p>Price: ₹{seed.price}</p>
                  <p>Stock: {seed.quantity}</p>
                  <button onClick={() => addToCart(seed)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )
      */}
    </div>
  );
};

export default SeedList;
