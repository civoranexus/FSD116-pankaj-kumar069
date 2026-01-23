const mongoose = require("mongoose");

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY + BUG FIXED)
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
      index: true,
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
          min: [1, "Quantity must be at least 1"],
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

    // ❌ OLD BASIC STATUS (learning purpose – DO NOT USE)
    /*
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Completed"],
      default: "Pending",
    },
    */

    // ✅ FINAL PROFESSIONAL STATUS SYSTEM
    // 🔥 IMPORTANT FIX:
    // Frontend MUST send same case-sensitive value
    status: {
      type: String,
      enum: [
        "Pending",     // order placed
        "Confirmed",   // staff/admin confirmed
        "Packed",      // packed in nursery
        "Shipped",     // out for delivery
        "Completed",   // delivered
        "Cancelled",   // cancelled by admin/staff
      ],
      default: "Pending",
      index: true,
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
          ref: "User",
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
      index: true,
    },

    placedByRole: {
      type: String,
      enum: ["customer", "staff", "admin"],
      required: true,
    },

    /* =========================
       SOFT DELETE
    ========================== */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   AUTO ORDER NUMBER
========================== */
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    // ❌ OLD (collision risk)
    // this.orderNumber = "ORD-" + Date.now();

    // ✅ SAFE VERSION
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

/* ======================================================
   🔥 NEW: STATUS CHANGE HELPER (IMPORTANT)
   Ensures:
   - statusHistory auto update
   - clean audit trail
====================================================== */
orderSchema.methods.updateStatus = function (newStatus, userId) {
  // ❌ OLD: Direct status change (no history)
  // this.status = newStatus;

  // ✅ NEW: Safe & auditable status update
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
  });
};

module.exports = mongoose.model("Order", orderSchema);
