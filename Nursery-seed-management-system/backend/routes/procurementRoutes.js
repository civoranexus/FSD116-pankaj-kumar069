const express = require("express");
const router = express.Router();
const { addProcurement, getProcurements } = require("../controllers/procurementController");

router.post("/", addProcurement);
router.get("/", getProcurements);

module.exports = router;