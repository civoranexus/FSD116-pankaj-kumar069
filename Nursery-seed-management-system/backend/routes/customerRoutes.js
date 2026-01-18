const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

const { protect, authorize } = require("../middleware/authMiddleware");

// -------------------- Customer Routes --------------------

// Get all customers (basic list for dropdowns)
// Access: admin + staff
// ⚠️ NOTE: Customer dropdown needs customers list too,
// so we allow customer role as well (or restrict to admin/staff only)
router.get("/", protect, authorize("admin", "staff", "customer"), async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }, "_id name email");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});

// Get customer by ID
// Access: admin + staff OR the same customer
router.get("/:id", protect, async (req, res) => {
  try {
    // Only admin/staff or same customer can access
    if (req.user.role !== "admin" && req.user.role !== "staff" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const customer = await User.findById(req.params.id, "_id name email");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
});

// Get catalog (inventory visible to customers)
// Access: admin + staff + customer
router.get("/:id/catalog", protect, authorize("admin", "staff", "customer"), async (req, res) => {
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

// Get customer’s orders
// Access: admin + staff OR the same customer
router.get("/:id/orders", protect, async (req, res) => {
  try {
    // Only admin/staff or same customer can access
    if (req.user.role !== "admin" && req.user.role !== "staff" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ customer: req.params.id })
      .populate("items.product", "name type price")
      .populate("customer", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer orders", error: error.message });
  }
});

module.exports = router;
