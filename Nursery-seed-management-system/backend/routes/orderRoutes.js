const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware"); 
// protect → JWT token check
// authorize → Role-based access control

/* ----------------- Customer Routes ----------------- */
// Place an order → Only customer
router.post("/", protect, authorize("customer"), placeOrder);

/* ----------------- Admin / Staff Routes ----------------- */
// Get all orders → Only admin/staff
router.get("/", protect, authorize("admin", "staff"), getOrders);

// Get single order by ID → Admin/staff
router.get("/:id", protect, authorize("admin", "staff"), getOrderById);

// Update order status → Admin/staff
router.put("/:id/status", protect, authorize("admin", "staff"), updateOrderStatus);

// Delete order → Admin only
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
