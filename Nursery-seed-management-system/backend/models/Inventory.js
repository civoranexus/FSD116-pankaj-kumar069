const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Plant/Seed name
  },
  type: {
    type: String,
    enum: ["seed", "sapling", "plant"],
    required: true,
  },
  batchId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  plantingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Available", "Low Stock", "Ready for Sale", "Under Treatment"],
    default: "Available",
  },
  price: { type: Number, required: true, default: 0 },

  // ✅ Add supplier reference
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: false // optional, but recommended
  }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);