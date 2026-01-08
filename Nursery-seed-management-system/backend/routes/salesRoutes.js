const express = require("express");
const router = express.Router();
const { getSalesReport, getMonthlySales } = require("../controllers/salesController");

// Sales report with filters
router.get("/report", getSalesReport);

// Monthly sales aggregation
router.get("/report/monthly", getMonthlySales);

module.exports = router;