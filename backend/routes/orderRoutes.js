const express = require("express");
const router = express.Router();
const { placeOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");

// Place order
router.post("/", placeOrder);

// Get all orders
router.get("/", getOrders);

// Update order status
router.put("/:id", updateOrderStatus);

module.exports = router;