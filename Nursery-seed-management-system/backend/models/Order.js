const mongoose = require("mongoose");

/* ======================================================
   CONSTANT ENUMS (🔥 SINGLE SOURCE OF TRUTH)
====================================================== */
const ORDER_STATUSES = [
  "pending",
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
];

const PAYMENT_STATUS = ["pending", "paid", "failed", "cod"];

const PAYMENT_METHODS = ["cod", "upi", "card", "netbanking"];

const USER_ROLES = ["customer", "staff", "admin"];

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY)
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
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    /* =========================
       TOTAL AMOUNT
    ========================= */
    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    /* =========================
       ORDER STATUS
    ========================= */
    status: {
      type: String,
      enum: ORDER_STATUSES,
      // default: "pending",
      index: true,
    },

    /* =========================
       STATUS HISTORY
    ========================= */
    statusHistory: [
      {
        status: {
          type: String,
          enum: ORDER_STATUSES,
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
      enum: PAYMENT_STATUS,
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "cod",
    },

    /* =========================
       ORDER NUMBER
    ========================= */
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* =========================
       PLACED BY ROLE
    ========================= */
    placedByRole: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },

    /* =========================
       SOFT DELETE
    ========================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ======================================================
   PRE-SAVE HOOK
====================================================== */
orderSchema.pre("save", function () {
  if (!this.items || this.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  // auto calculate total
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // auto order number
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  // initial status history
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
   STATUS UPDATE METHOD (SAFE)
====================================================== */
orderSchema.methods.updateStatus = async function (newStatus, userId) {
  if (!ORDER_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid order status: ${newStatus}`);
  }

  this.status = newStatus;

  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
  });

  await this.save();
};

/* ======================================================
   EXPORT MODEL
====================================================== */
module.exports = mongoose.model("Order", orderSchema);
