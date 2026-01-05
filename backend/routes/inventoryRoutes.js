const express = require("express");
const router = express.Router();
const { addStock, getStock, updateStock, deleteStock } = require("../controllers/inventoryController");

// Add stock
router.post("/", addStock);

// Get all stock
router.get("/", getStock);

// Update stock
router.put("/:id", updateStock);

// Delete stock
router.delete("/:id", deleteStock);

module.exports = router;