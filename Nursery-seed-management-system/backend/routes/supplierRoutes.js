const express = require("express");
const router = express.Router();

const { addSupplier, getSuppliers } = require("../controllers/supplierController");

// Auth Middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// Add supplier (admin + staff)
router.post("/", protect, authorize("admin", "staff"), addSupplier);

// Get all suppliers (admin + staff)
router.get("/", protect, authorize("admin", "staff"), getSuppliers);

module.exports = router;
