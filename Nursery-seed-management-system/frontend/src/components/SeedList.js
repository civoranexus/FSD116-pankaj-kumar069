// frontend/src/components/SeedList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const SeedList = () => {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------- Fetch seeds from backend --------------------
  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/inventory");
        setSeeds(data); // assume backend returns array of seeds
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching seeds");
        setLoading(false);
      }
    };

    fetchSeeds();
  }, []);

  // -------------------- Handle Add to Cart --------------------
  const handleAddToCart = (seed) => {
    // save in localStorage or global state (redux/context)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((item) => item._id === seed._id);

    if (exist) {
      // increase quantity if already in cart
      cart = cart.map((item) =>
        item._id === seed._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cart.push({ ...seed, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${seed.name} added to cart!`);
  };

  // -------------------- Render --------------------
  if (loading) return <h2>Loading seeds...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Available Seeds</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {seeds.map((seed) => (
          <div key={seed._id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h3>{seed.name}</h3>
            <p>Category: {seed.category}</p>
            <p>Price: ₹{seed.price}</p>
            <p>Stock: {seed.stock}</p>
            <button onClick={() => handleAddToCart(seed)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeedList;
