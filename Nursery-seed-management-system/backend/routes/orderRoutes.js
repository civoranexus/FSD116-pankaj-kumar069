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
Admin    → full access (admin + staff + customer)
Staff    → operational access (staff + customer)
Customer → only own data
=====================================================
*/

/* =====================================================
   CUSTOMER ROUTES
==================================================== */

// ✅ Customer + Staff + Admin → place order
router.post(
  "/",
  protect,
  authorize("customer", "staff", "admin"),
  placeOrder
);

// ✅ Customer → apne orders dekh sakta hai
router.get(
  "/myorders",
  protect,
  authorize("customer"),
  getMyOrders
);

/*
❌ OLD ROUTE ORDER (risk of conflict with :id)
router.get("/:id", ...)
*/

/* =====================================================
   STAFF & ADMIN ROUTES
==================================================== */

// ✅ Staff + Admin → saare orders
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
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

/* =====================================================
   ADMIN ONLY ROUTES
==================================================== */

// ✅ Admin → order delete
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

/*
=====================================================
⚠️ IMPORTANT NOTE (Future Upgrade)
-----------------------------------------------------
Agar future me chaho:
Customer → GET /orders/:id (sirf apna)
To alag route banana:
router.get("/myorders/:id", ...)
=====================================================
*/

module.exports = router;
