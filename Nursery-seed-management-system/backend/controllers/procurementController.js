const Procurement = require("../models/Procurement");

// Add procurement record
const addProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.create(req.body);
    res.status(201).json({ message: "Procurement record added", procurement });
  } catch (error) {
    res.status(500).json({ message: "Error adding procurement", error: error.message });
  }
};

// Get all procurement records
const getProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find().populate("supplier");
    res.json(procurements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching procurements", error: error.message });
  }
};

module.exports = { addProcurement, getProcurements };