const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
  plantName: {
    type: String,
    required: true,
  },
  checkDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Healthy", "Under Treatment", "Ready for Sale"],
    default: "Healthy",
  },
  notes: {
    type: String,
  },
  treatment: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);