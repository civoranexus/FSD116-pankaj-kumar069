const mongoose = require("mongoose");

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY + BUG FIXED)
====================================================== */
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

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

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

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
orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }

  // Add initial status history only once
  if (this.isNew) {
    this.statusHistory = [
      {
        status: this.status,
        changedBy: this.customer,
      },
    ];
  }
});

/* ======================================================
   🔥 STATUS CHANGE HELPER
====================================================== */
orderSchema.methods.updateStatus = function (newStatus, userId) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
  });
};

module.exports = mongoose.model("Order", orderSchema);
