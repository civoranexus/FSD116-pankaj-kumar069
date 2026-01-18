const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* =========================
       CUSTOMER INFO
    ========================== */
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          min: 1, // ✅ professional validation
        },
        price: {
          type: Number,
          required: true, // 🔥 added for invoice
          min: 0,
        },
      },
    ],

    /* =========================
       PRICING
    ========================== */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* =========================
       ORDER STATUS
    ========================== */

    // ❌ OLD CODE (kept for learning)
    /*
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Completed"],
      default: "Pending",
    },
    */

    // ✅ NEW PROFESSIONAL STATUS SYSTEM
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
    },

    /* =========================
       STATUS HISTORY (AUDIT)
    ========================== */
    statusHistory: [
      {
        status: String,
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
========================== */
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = "ORD-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
