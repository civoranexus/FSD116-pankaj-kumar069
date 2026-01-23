const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

/* ======================================================
   ORDER STATUS CONSTANT
   (Single source of truth – VERY IMPORTANT)
====================================================== */
const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

/* ======================================================
   PLACE ORDER
====================================================== */
const placeOrder = async (req, res) => {
  try {
    let customerId;

    /* ❌ OLD (implicit logic) */
    /*
    if (req.user.role === "customer") {
      customerId = req.user._id;
    } else {
      customerId = req.body.customer;
    }
    */

    /* ✅ NEW (explicit + safe) */
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

    /* ❌ OLD (no transaction safety) */
    /*
    for (const item of items) {
      const product = await Inventory.findById(item.product);
      product.quantity -= item.quantity;
      await product.save();
    }
    */

    /* ✅ NEW (validation + clarity) */
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

      // stock deduction
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    /* ❌ OLD BASIC CREATE */
    /*
    const order = await Order.create({
      customer: customerId,
      items: processedItems,
      totalAmount,
      status: "pending",
    });
    */

    /* ✅ NEW PROFESSIONAL CREATE */
    const order = await Order.create({
      customer: customerId,
      items: processedItems,
      totalAmount,
      status: ORDER_STATUS.PENDING,
      placedByRole: req.user.role,
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          changedBy: req.user._id,
          changedAt: new Date(),
        },
      ],
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
   GET ALL ORDERS (Admin / Staff)
====================================================== */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
})
 // ✅ NEW safety
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
   GET MY ORDERS (Customer)
====================================================== */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
      isDeleted: false, // ✅ NEW
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
====================================================== */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* ❌ OLD (missing admin bypass) */
    /*
    if (req.user.role === "customer" &&
        order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    */

    /* ✅ NEW (correct & clear) */
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
   UPDATE ORDER STATUS (🔥 MAIN FIX)
====================================================== */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = Object.values(ORDER_STATUS);

    /* ❌ OLD (silent failure risk) */
    /*
    if (!allowedStatus.includes(status)) {}
    */

    /* ✅ NEW (hard validation) */
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* ❌ OLD (customer ownership check – WRONG) */
    /*
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    */

    /* ✅ NEW (admin / staff only – route handles role) */
    order.status = status;
    order.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date(),
    });

    await order.save();

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
   DELETE ORDER (Soft delete)
====================================================== */
const deleteOrder = async (req, res) => {
  try {
    /* ❌ OLD (hard delete) */
    /*
    await Order.findByIdAndDelete(req.params.id);
    */

    /* ✅ NEW (soft delete – production safe) */
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

module.exports = {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  ORDER_STATUS,
};
