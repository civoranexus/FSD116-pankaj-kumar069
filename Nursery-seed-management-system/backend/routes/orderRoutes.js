const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================================
ROLE RULES (PROFESSIONAL STANDARD)
-----------------------------------------------------
Admin    → full access
Staff    → operational access
Customer → only own data
=====================================================
*/

/* =====================================================
   CUSTOMER ROUTES
==================================================== */

// ✅ Customer / Staff / Admin → place order
router.post(
  "/",
  protect,
  authorize("customer", "staff", "admin"),
  placeOrder
);

// ✅ Customer → own orders
// 🔥 MUST be before "/:id"
router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  getMyOrders
);

/* =====================================================
   STAFF & ADMIN ROUTES
==================================================== */

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getOrders
);

/* =====================================================
   DYNAMIC ROUTES (ALWAYS LAST)
==================================================== */

router.get(
  "/:id",
  protect,
  authorize("admin", "staff", "customer"),
  getOrderById
);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

/* =====================================================
   ADMIN ONLY
==================================================== */

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

module.exports = router;
