const mongoose = require("mongoose");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

/* ======================================================
   ORDER STATUS (🔥 SINGLE SOURCE OF TRUTH)
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
   PLACE ORDER (🔥 FINAL – EXPRESS SAFE)
====================================================== */
const placeOrder = async (req, res) => {
  let session;

  try {
    /* ❌ OLD (implicit session issues sometimes)
    const session = await mongoose.startSession();
    session.startTransaction();
    */

    /* ✅ NEW (SAFE INIT) */
    session = await mongoose.startSession();
    session.startTransaction();

    let customerId;

    /* =========================
       DETERMINE CUSTOMER
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

    /* ❌ OLD
    if (!items || !Array.isArray(items) || items.length === 0) {}
    */

    /* ✅ NEW (STRICT CHECK) */
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    let totalAmount = 0;
    const processedItems = [];

    /* =========================
       PROCESS ITEMS
    ========================= */
    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Each item must have valid product and quantity",
        });
      }

      const product = await Inventory.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      product.quantity -= item.quantity;
      await product.save({ session });

      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    /* =========================
       CREATE ORDER
    ========================= */
    const [order] = await Order.create(
      [
        {
          customer: customerId,
          items: processedItems,
          totalAmount,
          status: "placed",
          placedByRole: req.user.role,
          isDeleted: false,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    return res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    if (session) await session.abortTransaction();

    console.error("Place order error:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  } finally {
    if (session) session.endSession();
  }
};

/* ======================================================
   GET ALL ORDERS (ADMIN / STAFF)
====================================================== */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("customer", "name email")
      .populate("items.product", "name type price")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Server error" });
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

    return res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ORDER BY ID
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

    return res.json(order);
  } catch (error) {
    console.error("Get order by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE ORDER STATUS
====================================================== */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.updateStatus(status, req.user._id);

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    return res.json({
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   DELETE ORDER (SOFT)
====================================================== */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDeleted = true;
    await order.save();

    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   EXPORT
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
   ❌ OLD / NOTES (KEPT FOR STUDY)
====================================================== */
/*
- Controller NEVER uses next()
- All responses return res.json / res.status
- Safe for Express routing
*/
