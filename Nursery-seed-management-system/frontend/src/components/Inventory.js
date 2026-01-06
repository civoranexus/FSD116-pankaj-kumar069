import React, { useState, useEffect } from "react";
import API from "../api";

function Inventory() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        type: "",
        batchId: "",
        quantity: "",
        location: "",
        status: "Available"
    });

    // Fetch inventory on load
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await API.get("/inventory");
                setItems(res.data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchInventory();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add new stock
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                quantity: Number(form.quantity) // ensure number
            };
            const res = await API.post("/inventory", payload);
            alert("Stock added successfully!");
            setItems([...items, res.data.stock]);
            setForm({ name: "", type: "", batchId: "", quantity: "", location: "", status: "Available" });
        } catch (error) {
            console.error("Error adding stock:", error.response?.data || error.message);
            alert("Error adding stock: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h2>Inventory Management</h2>

            {/* Add Stock Form */}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br />
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="seed">Seed</option>
                    <option value="sapling">Sapling</option>
                    <option value="fertilizer">fertilizer</option>
                    <option value="tool">tool</option>
                </select>
                <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} /><br />
                <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} /><br />
                <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select><br />
                <button type="submit">Add Stock</button>
            </form>

            {/* Inventory List */}
            <h3>Current Inventory</h3>
            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        {item.name} ({item.type}) — {item.quantity} units — {item.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Inventory;