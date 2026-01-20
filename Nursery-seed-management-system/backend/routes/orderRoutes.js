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
ROLE RULES (IMPORTANT – PROFESSIONAL STANDARD)
-----------------------------------------------------
Admin    → sab ka data (admin + staff + customer)
Staff    → staff + customer ka data
Customer → sirf apna data
=====================================================
*/

/* =====================================================
   CUSTOMER ROUTES
==================================================== */

// Customer + Staff + Admin → order place
router.post(
  "/",
  protect,
  authorize("customer", "staff", "admin"),
  placeOrder
);

// Customer → apne orders dekh sakta hai
router.get("/myorders", protect, authorize("customer"), getMyOrders);

/* =====================================================
   STAFF & ADMIN ROUTES
==================================================== */

// Staff + Admin → saare orders
router.get("/", protect, authorize("admin", "staff"), getOrders);

// Staff + Admin → kisi bhi order ka detail
router.get("/:id", protect, authorize("admin", "staff"), getOrderById);

// Staff + Admin → order status update
router.put("/:id/status", protect, authorize("admin", "staff"), updateOrderStatus);

/* =====================================================
   ADMIN ONLY ROUTES
==================================================== */

// Admin → order delete
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
