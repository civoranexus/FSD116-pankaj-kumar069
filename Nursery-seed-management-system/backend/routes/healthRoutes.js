const express = require("express");
const router = express.Router();
const { addHealthRecord, getHealthRecords, updateHealthRecord } = require("../controllers/healthController");

// Add health record
router.post("/", addHealthRecord);

// Get all health records
router.get("/", getHealthRecords);

// Update health record
router.put("/:id", updateHealthRecord);

module.exports = router;