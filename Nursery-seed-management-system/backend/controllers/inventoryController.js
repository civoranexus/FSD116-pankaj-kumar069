const Inventory = require("../models/Inventory");

// Add new stock
const addStock = async (req, res) => {
  try {
    const stock = await Inventory.create(req.body);
    res.status(201).json({ message: "Stock added successfully", stock });
  } catch (error) {
    console.error("Error adding stock:", error); // 👈 log full error
    res.status(500).json({ message: "Error adding stock", error: error.message });
  }
};

// Get all stock
const getStock = async (req, res) => {
  try {
    const stock = await Inventory.find();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error: error.message });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const stock = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Stock updated successfully", stock });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
};

// Delete stock
const deleteStock = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock", error: error.message });
  }
};

module.exports = { addStock, getStock, updateStock, deleteStock };