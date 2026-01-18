const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

/* ======================================================
   PLACE ORDER
   - Customer: only for himself
   - Staff/Admin: can place order for any customer
   - Stock deduction
   - Status history maintain
====================================================== */
const placeOrder = async (req, res) => {
  try {
    // ❌ OLD (unsafe – customer id spoof ho sakta tha)
    // let customerId = req.body.customer;

    let customerId;

    if (req.user.role === "customer") {
      // ✅ Customer sirf apne liye order karega
      customerId = req.user._id;
    } else {
      // ✅ Staff/Admin kisi bhi customer ke liye
      if (!req.body.customer) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
      customerId = req.body.customer;
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (let item of items) {
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

      // ✅ Stock deduction
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // 🔥 future invoice ke liye
      });
    }

    /* ❌ OLD SIMPLE ORDER CREATE */
    /*
    const order = await Order.create({
      customer: customerId,
      items: processedItems,
      totalAmount,
      status: "pending",
    });
    */

    /* ✅ NEW PROFESSIONAL ORDER CREATE */
    const order = await Order.create({
      customer: customerId,
      items: processedItems,
      totalAmount,
      status: "Pending",
      placedByRole: req.user.role, // admin / staff / customer
      statusHistory: [
        {
          status: "Pending",
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
   GET ALL ORDERS
   - Admin/Staff only
====================================================== */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
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
   GET MY ORDERS
   - Customer only
====================================================== */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
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
   - Admin/Staff: any order
   - Customer: only own order
====================================================== */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Customer restriction
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
   UPDATE ORDER STATUS
   - Admin / Staff only
   - Status history maintained
====================================================== */
const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Completed",
    ];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* ❌ OLD DIRECT UPDATE */
    /*
    order.status = req.body.status;
    await order.save();
    */

    /* ✅ PROFESSIONAL UPDATE */
    order.status = req.body.status;
    order.statusHistory.push({
      status: req.body.status,
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
   DELETE ORDER
   - Admin only
====================================================== */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

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
};
