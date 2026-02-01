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

/* ❌ OLD:
router.post("/", protect, placeOrder); // no role check
*/

/* ✅ NEW:
- Any logged-in user (customer / staff / admin) can place order
- authorize middleware ensures role-based access
*/
router.post(
  "/",
  protect,
  authorize("customer", "staff", "admin"),
  placeOrder
);

/* ❌ OLD:
router.get("/my-orders", protect, getMyOrders); // no role check
*/

/* ✅ NEW:
- Only customer can fetch their own orders
- Must be before dynamic "/:id" route
*/
router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  getMyOrders
);

/* =====================================================
   STAFF & ADMIN ROUTES
==================================================== */

/* ❌ OLD:
router.get("/", protect, getOrders); // no role check
*/

/* ✅ NEW:
- Only admin or staff can fetch all orders
- Populates customer + items
- Sorted by creation date
*/
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getOrders
);

/* =====================================================
   DYNAMIC ROUTES (ALWAYS LAST)
==================================================== */

/*
- Fetch single order by ID
- Role-based access:
  - Customer → only own order
  - Staff / Admin → any order
*/
router.get(
  "/:id",
  protect,
  authorize("admin", "staff", "customer"),
  getOrderById
);

/*
- Update order status (admin / staff)
- Route: /api/orders/:id/status
*/
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

/* =====================================================
   ADMIN ONLY
==================================================== */

/*
- Soft delete order
- Only admin allowed
*/
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

/* =====================================================
   EXPORT ROUTER
==================================================== */
module.exports = router;
