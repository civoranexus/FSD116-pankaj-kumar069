const mongoose = require("mongoose");

/* ======================================================
   ORDER SCHEMA (PRODUCTION READY – FIXED & SAFE)
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
       🔥 FIX:
       - items empty hone par error aayega
       - price required rakha (snapshot of price)
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
       🔥 FIX:
       - auto calculated in pre-save
    ========================= */
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
      default: 0, // 🔥 IMPORTANT FIX
    },

    /* =========================
       ORDER STATUS
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
      enum: ["customer", "staff", "admin"],
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
  {
    timestamps: true,
  }
);

/* ======================================================
   PRE-SAVE HOOK (🔥 MAJOR FIX HERE)
====================================================== */
orderSchema.pre("save", function (next) {
  try {
    /* ❌ OLD (NO VALIDATION)
       this.totalAmount manually expected
    */

    /* ✅ NEW FIX 1: items validation */
    if (!this.items || this.items.length === 0) {
      return next(new Error("Order must contain at least one item"));
    }

    /* ✅ NEW FIX 2: auto-calculate totalAmount */
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    /* ✅ NEW FIX 3: auto order number */
    if (!this.orderNumber) {
      this.orderNumber =
        "ORD-" +
        Date.now() +
        "-" +
        Math.floor(1000 + Math.random() * 9000);
    }

    /* ✅ NEW FIX 4: status history only on create */
    if (this.isNew) {
      this.statusHistory = [
        {
          status: this.status,
          changedBy: this.customer,
          changedAt: new Date(),
        },
      ];
    }

    // next();
  } 
  catch (err) {
    console.log(err); 
  }
});

/* ======================================================
   STATUS UPDATE METHOD (SAFE ASYNC)
====================================================== */
orderSchema.methods.updateStatus = async function (newStatus, userId) {
  this.status = newStatus;

  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    changedAt: new Date(),
  });

  await this.save();
};

/* ======================================================
   EXPORT MODEL
====================================================== */
module.exports = mongoose.model("Order", orderSchema);

/* ======================================================
   ❌ OLD / UNUSED CODE (KEPT FOR LEARNING)
====================================================== */
// ❌ OLD: no async safety
// orderSchema.methods.updateStatus = function (newStatus, userId) {
//   this.status = newStatus;
//   this.statusHistory.push({
//     status: newStatus,
//     changedBy: userId,
//   });
// };
