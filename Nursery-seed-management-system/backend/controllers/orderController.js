const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// Place new order
const placeOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    let totalAmount = 0;

    // Deduct stock for each item
    for (let item of items) {
      const product = await Inventory.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      await product.save();

      totalAmount += item.quantity * 10; // For now, assume each unit = ₹10 (we can enhance later)
    }

    const order = await Order.create({
      customer,
      items,
      totalAmount,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer").populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

module.exports = { placeOrder, getOrders, updateOrderStatus };