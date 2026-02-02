const mongoose = require("mongoose");

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY – PROFESSIONAL)
   🔹 Clean, safe, ready for status updates
   🔹 Soft delete supported
   🔹 Full status history
====================================================== */
const orderSchema = new mongoose.Schema(
  {
    /* =========================
       CUSTOMER
    ========================= */
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       ORDER ITEMS
    ========================= */
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
       TOTAL AMOUNT
    ========================= */
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    /* =========================
       ORDER STATUS
       🔥 MAIN FIX
       - All possible values included
       - Default = placed
    ========================= */
    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "placed",
      index: true,
    },

    /* =========================
       STATUS HISTORY
       - Tracks all status changes
       - Changed by which user
    ========================= */
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "placed",
            "confirmed",
            "packed",
            "shipped",
            "delivered",
            "completed",
            "cancelled",
          ],
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
    ========================= */
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
       ORDER NUMBER
       - Auto-generated if not provided
    ========================= */
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* =========================
       PLACED BY ROLE
       - customer, staff, admin
    ========================= */
    placedByRole: {
      type: String,
      enum: ["customer", "staff", "admin"],
      required: true,
    },

    /* =========================
       SOFT DELETE
       - Use this instead of hard delete
    ========================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   PRE-SAVE HOOK
   - Auto-generate order number if missing
   - Initialize status history on creation
====================================================== */
orderSchema.pre("save", function (next) {
  // Auto order number
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" +
      Date.now() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }

  // Initial status history (ONLY ON CREATE)
  if (this.isNew) {
    this.statusHistory = [
      {
        status: this.status,
        changedBy: this.customer,
        changedAt: new Date(),
      },
    ];
  }

  next();
});

/* ======================================================
   STATUS UPDATE HELPER (PROFESSIONAL & ASYNC)
   🔹 Updates order.status
   🔹 Pushes new record to statusHistory
   🔹 Safe: call with await
====================================================== */
orderSchema.methods.updateStatus = async function (newStatus, userId) {
  this.status = newStatus;

  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    changedAt: new Date(),
  });

  await this.save(); // 🔥 Save asynchronously
};

/* ======================================================
   EXPORT MODEL
====================================================== */
module.exports = mongoose.model("Order", orderSchema);

/* ======================================================
   ❌ OLD / UNUSED CODE (KEPT FOR REFERENCE)
====================================================== */
// Old synchronous updateStatus (removed, see above async version)
// orderSchema.methods.updateStatus = function (newStatus, userId) {
//   this.status = newStatus;
//   this.statusHistory.push({
//     status: newStatus,
//     changedBy: userId,
//   });
// };
