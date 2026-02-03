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
ROLE RULES (FINAL & CORRECT)
-----------------------------------------------------
Admin    → full access
Staff    → operational access
Customer → only own data
=====================================================
*/

/* =====================================================
   PLACE ORDER (🔥 FINAL & SAFE)
==================================================== */

/*
❌ OLD (BUGGY / CONFUSING)
- Staff/Admin ko allow kiya tha
- Frontend customerId nahi bhejta
- Controller me 500 error aata tha

router.post(
  "/",
  protect,
  authorize("customer", "staff", "admin"),
  placeOrder
);
*/

/* ✅ FINAL FIX:
- Sirf CUSTOMER order place karega
- Frontend + backend perfectly aligned
*/
router.post(
  "/",
  protect,
  authorize("customer"),
  placeOrder // ⚠️ FUNCTION CALL NAHI, REFERENCE HAI
);

/* =====================================================
   CUSTOMER ROUTES
==================================================== */

/*
❌ OLD:
router.get("/my-orders", protect, getMyOrders);
*/

/* ✅ FINAL:
- Sirf customer apne orders dekhega
- MUST be before "/:id"
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

/*
❌ OLD:
router.get("/", protect, getOrders);
*/

/* ✅ FINAL:
- Sirf admin & staff
*/
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getOrders
);

/* =====================================================
   STATUS UPDATE ROUTE (🔥 VERY IMPORTANT ORDER)
==================================================== */

/*
❗ IMPORTANT:
- Ye route "/:id" se pehle hona chahiye
- Warna "status" ko Express id samajh lega
*/
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

/* =====================================================
   GET ORDER BY ID
==================================================== */

/*
- Customer → sirf apna order
- Staff/Admin → koi bhi
*/
router.get(
  "/:id",
  protect,
  authorize("admin", "staff", "customer"),
  getOrderById
);

/* =====================================================
   ADMIN ONLY
==================================================== */

/*
- Soft delete
*/
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

/* =====================================================
   EXPORT
==================================================== */
module.exports = router;

/* =====================================================
   ❌ OLD / UNUSED ROUTES (KEPT FOR LEARNING)
==================================================== */
/*
// router.put("/:id", updateOrderStatus); ❌ unclear
// router.delete("/:id", deleteOrder); ❌ unsafe
*/
