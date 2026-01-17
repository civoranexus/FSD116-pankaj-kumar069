const express = require("express");
const router = express.Router();

const {
  addProcurement,
  getProcurements
} = require("../controllers/procurementController");

// Auth Middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// -------------------- Procurement Routes --------------------

// Add procurement (admin + staff)
router.post("/", protect, authorize("admin", "staff"), addProcurement);

// Get all procurements (admin + staff)
router.get("/", protect, authorize("admin", "staff"), getProcurements);

module.exports = router;
