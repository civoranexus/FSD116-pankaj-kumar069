const express = require("express");
const router = express.Router();
const { getSalesReport } = require("../controllers/salesController");

router.get("/report", getSalesReport);

module.exports = router;