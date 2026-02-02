const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

/* ======================================================
   ORDER STATUS (🔥 MUST MATCH Order MODEL ENUM)
   - Single source of truth
   - DO NOT hardcode values elsewhere
====================================================== */
const ORDER_STATUS = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
];

/* ======================================================
   PLACE ORDER
   - Handles both customer & admin/staff placing order
   - Deducts stock
   - Creates order with statusHistory
====================================================== */
const placeOrder = async (req, res) => {
  try {
    let customerId;

    /* =========================
       DETERMINE CUSTOMER ID
    ========================= */
    if (req.user.role === "customer") {
      customerId = req.user._id;
    } else {
      if (!req.body.customer) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
      customerId = req.body.customer;
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    let totalAmount = 0;
    const processedItems = [];

    /* =========================
       PROCESS EACH ITEM
    ========================= */
    for (const item of items) {
      const product = await Inventory.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      if (typeof product.price !== "number") {
        return res.status(400).json({
          message: `Price missing for ${product.name}`,
        });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    /* =========================
       CREATE ORDER
       - Status = placed (matches model)
       - statusHistory auto-handled by model pre-save
    ========================= */
    const order = await Order.create({
      customer: customerId,
      items: processedItems,
      totalAmount,
      status: "placed", // 🔥 MUST MATCH MODEL ENUM
      placedByRole: req.user.role,
      isDeleted: false, // 🔥 IMPORTANT: soft delete flag
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ALL ORDERS (ADMIN / STAFF)
   - Sorted newest first
   - Populates customer & item info
====================================================== */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("customer", "name email")
      .populate("items.product", "name type price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET MY ORDERS (CUSTOMER)
====================================================== */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
      isDeleted: false,
    })
      .populate("items.product", "name type price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ORDER BY ID
   - Customer can only access their own orders
====================================================== */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role === "customer" &&
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE ORDER STATUS (ADMIN / STAFF)
   - Safe: uses orderSchema.methods.updateStatus()
   - Only allows valid status from ORDER_STATUS enum
====================================================== */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 🔹 Validate status (must match enum in Order model)
    if (!ORDER_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔹 SAFE async update
    await order.updateStatus(status, req.user._id);

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    res.json({
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   DELETE ORDER (SOFT DELETE)
====================================================== */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDeleted = true;
    await order.save();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   EXPORT CONTROLLERS
====================================================== */
module.exports = {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

/* ======================================================
   ❌ OLD / UNUSED CODE KEPT FOR REFERENCE
====================================================== */
/*
const OLD_ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
*/
