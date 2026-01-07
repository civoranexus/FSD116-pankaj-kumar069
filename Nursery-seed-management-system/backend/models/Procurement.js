const mongoose = require("mongoose");

const procurementSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",   // ✅ directly linked to Inventory
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model("Procurement", procurementSchema);