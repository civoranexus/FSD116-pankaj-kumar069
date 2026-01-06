const Supplier = require("../models/Supplier");

// Add supplier
const addSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ message: "Supplier added successfully", supplier });
  } catch (error) {
    res.status(500).json({ message: "Error adding supplier", error: error.message });
  }
};

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers", error: error.message });
  }
};

module.exports = { addSupplier, getSuppliers };