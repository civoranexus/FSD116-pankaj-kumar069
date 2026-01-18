const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders, // ✅ Customer ke liye
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================================
ROLE RULES (IMPORTANT – PROFESSIONAL STANDARD)
-----------------------------------------------------
Admin    → sab ka data (admin + staff + customer)
Staff    → staff + customer ka data
Customer → sirf apna data
=====================================================
*/

/* =====================================================
   CUSTOMER ROUTES
===================================================== */

// ✅ Customer place order (sirf apna)
router.post(
  "/",
  protect,
  authorize("customer"),
  placeOrder
);

// ✅ Customer apne orders dekhega
// GET /orders/myorders
router.get(
  "/myorders",
  protect,
  authorize("customer"),
  getMyOrders
);

/* =====================================================
   STAFF & ADMIN ROUTES
===================================================== */

// ✅ Staff + Admin → saare customers ke orders
// ❌ Customer ko access nahi
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getOrders
);

// ✅ Staff + Admin → kisi bhi order ka detail
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getOrderById
);

// ✅ Staff + Admin → order status update
// Customer ye kaam kabhi nahi karega
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

/* =====================================================
   ADMIN ONLY ROUTES
===================================================== */

// ✅ Sirf Admin → order delete
// ❌ Staff bhi delete nahi kar sakta (professional rule)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

module.exports = router;
