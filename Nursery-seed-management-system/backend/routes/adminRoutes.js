const express = require("express");
const router = express.Router();

const { getUsers, getInventorySummary, getSalesReport } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware"); // ✅ destructure properly

// Admin-only routes
router.get("/users", protect, authorize("admin"), getUsers);
router.get("/inventory-summary", protect, authorize("admin"), getInventorySummary);
router.get("/sales-report", protect, authorize("admin"), getSalesReport);

module.exports = router;
