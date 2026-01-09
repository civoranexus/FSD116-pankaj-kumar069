const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// Place new order
const placeOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;
    let totalAmount = 0;

    // Validate items and calculate total
    for (let item of items) {
      const product = await Inventory.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save();

      // Ensure product has a price
      if (typeof product.price !== "number") {
        return res.status(400).json({ message: `Price missing for ${product.name}` });
      }

      totalAmount += item.quantity * product.price;
    }

    // Create order
    const order = await Order.create({ customer, items, totalAmount });

    // Populate for response
    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    res.status(201).json({ message: "Order placed successfully", order: populatedOrder });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
      .populate("customer", "name email")
      .populate("items.product", "name type price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

module.exports = { placeOrder, getOrders, updateOrderStatus, getOrderById, deleteOrder };