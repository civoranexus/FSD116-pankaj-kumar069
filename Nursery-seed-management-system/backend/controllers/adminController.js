const User = require("../models/User");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get inventory summary
const getInventorySummary = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ totalItems, inventory });
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory summary", error: error.message });
  }
};

// Get sales report
const getSalesReport = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ totalSales, orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales report", error: error.message });
  }
};

module.exports = { getUsers, getInventorySummary, getSalesReport };