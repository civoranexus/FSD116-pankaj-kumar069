const HealthRecord = require("../models/HealthRecord");

// Add health record
const addHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json({ message: "Health record added", record });
  } catch (error) {
    res.status(500).json({ message: "Error adding health record", error: error.message });
  }
};

// Get all health records
const getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health records", error: error.message });
  }
};

// Update health record
const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Health record updated", record });
  } catch (error) {
    res.status(500).json({ message: "Error updating health record", error: error.message });
  }
};

module.exports = { addHealthRecord, getHealthRecords, updateHealthRecord };