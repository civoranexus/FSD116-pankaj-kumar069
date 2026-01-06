const express = require("express");
const router = express.Router();
const { getUsers, getInventorySummary, getSalesReport } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");

// Admin-only routes
router.get("/users", protect, getUsers);
router.get("/inventory-summary", protect, getInventorySummary);
router.get("/sales-report", protect, getSalesReport);

module.exports = router;