const express = require("express");
const router = express.Router();

const {
  addStock,
  getStock,
  updateStock,
  deleteStock
} = require("../controllers/inventoryController");

// Auth Middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// -------------------- Inventory Routes --------------------

// Add stock (admin + staff)
router.post("/", protect, authorize("admin", "staff"), addStock);

// Get all stock (admin + staff + customer)
router.get("/", protect, authorize("admin", "staff", "customer"), getStock);

// Update stock (admin + staff)
router.put("/:id", protect, authorize("admin", "staff"), updateStock);

// Delete stock (admin only)
router.delete("/:id", protect, authorize("admin"), deleteStock);

module.exports = router;
