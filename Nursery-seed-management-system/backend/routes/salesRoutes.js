const express = require("express");
const router = express.Router();
const { getSalesReport, getMonthlySales } = require("../controllers/salesController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Sales report with filters (admin + staff only)
router.get("/report", protect, authorize("admin", "staff"), getSalesReport);

// Monthly sales aggregation (admin + staff only)
router.get("/report/monthly", protect, authorize("admin", "staff"), getMonthlySales);

module.exports = router;