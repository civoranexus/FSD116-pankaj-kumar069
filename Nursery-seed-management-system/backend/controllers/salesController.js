const Order = require("../models/Order");

const getSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    let filter = {};

    // ✅ Apply date filter if provided
    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    }

    const orders = await Order.find(filter).populate("items.product");

    let totalOrders = orders.length;
    let totalItemsSold = 0;
    let totalRevenue = 0;
    let productSales = {};
    let supplierSales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.product;
        if (!product) return;

        totalItemsSold += item.quantity;
        const revenue = item.quantity * (product.price || 0);
        totalRevenue += revenue;

        // ✅ Product-wise aggregation
        if (!productSales[product.name]) {
          productSales[product.name] = { quantitySold: 0, revenue: 0 };
        }
        productSales[product.name].quantitySold += item.quantity;
        productSales[product.name].revenue += revenue;

        // ✅ Supplier-wise aggregation
        const supplierName = product.supplier?.name || "Unknown Supplier";
        if (!supplierSales[supplierName]) {
          supplierSales[supplierName] = { quantitySold: 0, revenue: 0 };
        }
        supplierSales[supplierName].quantitySold += item.quantity;
        supplierSales[supplierName].revenue += revenue;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    const topSuppliers = Object.entries(supplierSales)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue) // ✅ sort by revenue
      .slice(0, 5);

    res.json({ totalOrders, totalItemsSold, totalRevenue, topProducts, topSuppliers });
  } catch (error) {
    console.error("Error generating sales report:", error.message);
    res.status(500).json({ message: "Error generating sales report", error: error.message });
  }
};

module.exports = { getSalesReport };