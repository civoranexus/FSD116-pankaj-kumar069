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

// ❌ OLD (without soft-delete safety)
// router.get("/", protect, authorize("admin", "staff"), getOrders);

// ✅ NEW (safe & clear)
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getOrders
);

// ❌ OLD (customer could conflict if added later)
// router.get("/:id", ...);

// ✅ Staff + Admin → kisi bhi order ka detail
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getOrderById
);

// ❌ OLD (PUT "/:id")
// router.put("/:id", updateOrderStatus);

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

// ❌ OLD (hard delete, dangerous)
// router.delete("/:id", protect, authorize("admin"), deleteOrder);

// ✅ NEW (soft delete handled in controller)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

/*
=====================================================
⚠️ IMPORTANT NOTES (VERY IMPORTANT)
-----------------------------------------------------

1️⃣ Route order is CRITICAL
--------------------------------
/myorders must come BEFORE /:id
Otherwise Express will treat "myorders" as ":id"

2️⃣ Status update must be a separate route
--------------------------------
PUT /orders/:id/status
This avoids confusion with future updates

3️⃣ Customer order detail (future-safe)
--------------------------------
If later needed:
router.get("/myorders/:id", protect, authorize("customer"), ...)

4️⃣ NEVER expose /:id directly to customer
--------------------------------
Security risk (ID guessing attack)

=====================================================
*/

module.exports = router;
