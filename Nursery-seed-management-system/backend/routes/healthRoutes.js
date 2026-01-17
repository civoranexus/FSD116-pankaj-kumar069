const express = require("express");
const router = express.Router();

const {
  addHealthRecord,
  getHealthRecords,
  updateHealthRecord
} = require("../controllers/healthController");

// Auth Middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// -------------------- Health Routes --------------------

// Add health record (admin + staff)
router.post("/", protect, authorize("admin", "staff"), addHealthRecord);

// Get all health records (admin + staff)
router.get("/", protect, authorize("admin", "staff"), getHealthRecords);

// Update health record (admin + staff)
router.put("/:id", protect, authorize("admin", "staff"), updateHealthRecord);

module.exports = router;
