const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Plant/Seed name
      trim: true,
    },
    type: {
      type: String,
      enum: ["seed", "sapling", "plant"],
      required: true,
    },
    batchId: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
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
    price: {
      type: Number,
      required: true,
      min: [1, "Price must be greater than 0"], // ✅ prevents 0-price items
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false, // optional, but recommended
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);