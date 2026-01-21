const mongoose = require("mongoose");

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY)
====================================================== */
const orderSchema = new mongoose.Schema(
  {
    /* =========================
       CUSTOMER INFO
    ========================== */
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster customer order queries
    },

    /* =========================
       ORDER ITEMS
    ========================== */
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"], // ✅ validation message
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],

    /* =========================
       PRICING
    ========================== */
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    /* =========================
       ORDER STATUS
    ========================== */

    // ❌ OLD BASIC STATUS (kept for learning)
    /*
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Completed"],
      default: "Pending",
    },
    */

    // ✅ FINAL PROFESSIONAL STATUS SYSTEM
    status: {
      type: String,
      enum: [
        "Pending",     // order placed
        "Confirmed",   // staff/admin confirmed
        "Packed",      // packed in nursery
        "Shipped",     // out for delivery
        "Completed",   // delivered
        "Cancelled",   // admin/staff cancelled
      ],
      default: "Pending",
      index: true, // 🔥 dashboard filters fast
    },

    /* =========================
       STATUS HISTORY (AUDIT LOG)
    ========================== */
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // staff/admin
        },
      },
    ],

    /* =========================
       PAYMENT INFO
    ========================== */
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "COD"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking"],
      default: "COD",
    },

    /* =========================
       ORDER META INFO
    ========================== */
    orderNumber: {
      type: String,
      unique: true,
      index: true, // 🔥 invoice / search fast
    },

    placedByRole: {
      type: String,
      enum: ["customer", "staff", "admin"],
      required: true,
    },

    /* =========================
       SOFT DELETE (PRO LEVEL)
    ========================== */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* =========================
   AUTO ORDER NUMBER
   (Safe & Unique)
========================== */
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    // ❌ OLD (time only – collision risk)
    // this.orderNumber = "ORD-" + Date.now();

    // ✅ NEW (time + random – safer)
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
