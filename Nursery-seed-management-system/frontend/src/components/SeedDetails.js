import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SeedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seed, setSeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchSeed = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/inventory/${id}`);
        setSeed(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching seed details");
        setLoading(false);
      }
    };
    fetchSeed();
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((item) => item._id === seed._id);

    if (exist) {
      cart = cart.map((item) =>
        item._id === seed._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      cart.push({ ...seed, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${seed.name} added to cart!`);
    navigate("/cart"); // optional: redirect to cart
  };

  if (loading) return <h2>Loading seed details...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!seed) return <h2>Seed not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{seed.name}</h2>
      <p>Category: {seed.category}</p>
      <p>Price: ₹{seed.price}</p>
      <p>Stock: {seed.stock}</p>
      <p>Description: {seed.description || "No description available."}</p>

      <div style={{ marginTop: "10px" }}>
        <label>
          Quantity:{" "}
          <input
            type="number"
            min="1"
            max={seed.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={handleAddToCart} style={{ marginTop: "10px" }}>
        Add to Cart
      </button>
    </div>
  );
};

export default SeedDetails;
