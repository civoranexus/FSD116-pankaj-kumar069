const Procurement = require("../models/Procurement");
const Inventory = require("../models/Inventory");

// Add procurement record
const addProcurement = async (req, res) => {
  try {
    const newProcurement = await Procurement.create(req.body);

    // Auto-update inventory stock
    const inventoryItem = await Inventory.findById(newProcurement.productName);
    if (inventoryItem) {
      inventoryItem.quantity += newProcurement.quantity;
      await inventoryItem.save();
    }

    // ✅ Re-query with populate
    const procurement = await Procurement.findById(newProcurement._id)
      .populate("supplier")
      .populate("productName");

    res.status(201).json({ message: "Procurement recorded successfully", procurement });
  } catch (error) {
    console.error("Error adding procurement:", error.message);
    res.status(500).json({ message: "Error adding procurement", error: error.message });
  }
};


// Get all procurement records
const getProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate("supplier")
      .populate("productName");   // ✅ populate Inventory reference
    res.json(procurements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching procurements", error: error.message });
  }
};

module.exports = { addProcurement, getProcurements };