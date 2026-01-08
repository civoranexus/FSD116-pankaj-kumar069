const express = require("express");
const router = express.Router();
const { placeOrder, getOrders, updateOrderStatus, getOrderById, deleteOrder } = require("../controllers/orderController");

router.post("/", placeOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);   // ✅ new route
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);


module.exports = router;