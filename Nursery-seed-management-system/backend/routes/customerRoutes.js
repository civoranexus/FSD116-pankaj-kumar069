const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

// ✅ Get all customers (basic list for dropdowns)
router.get("/", async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }, "_id name email");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});

// ✅ Get customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id, "_id name email");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
});

// ✅ Get catalog (inventory visible to customers)
router.get("/:id/catalog", async (req, res) => {
  try {
    const inventory = await Inventory.find(
      { status: { $in: ["Available", "Ready for Sale"] } },
      "_id name type quantity price status"
    );
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching catalog", error: error.message });
  }
});

// ✅ Get customer’s orders
router.get("/:id/orders", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.id })
      .populate("items.product", "name type price")
      .populate("customer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer orders", error: error.message });
  }
});

module.exports = router;