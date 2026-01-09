const Order = require("../models/Order");

// Sales report with filters
const getSalesReport = async (req, res) => {
  try {
    const { start, end, supplierId, productId } = req.query;
    let filter = {};

    // Date range filter
    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    }

    // Fetch orders with product + supplier populated
    const orders = await Order.find(filter)
      .populate({
        path: "items.product",
        populate: { path: "supplier", select: "name" }
      })
      .populate("customer", "name email");

    if (orders.length === 0) {
      return res.json({
        start,
        end,
        totalOrders: 0,
        totalItemsSold: 0,
        totalRevenue: 0,
        topProducts: [],
        topSuppliers: []
      });
    }

    let totalOrders = orders.length;
    let totalItemsSold = 0;
    let totalRevenue = 0;
    let productSales = {};
    let supplierSales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.product;
        if (!product) return;

        // Apply product filter
        if (productId && product._id.toString() !== productId) return;
        // Apply supplier filter
        if (supplierId && (!product.supplier || product.supplier._id.toString() !== supplierId)) return;

        totalItemsSold += item.quantity;
        const revenue = item.quantity * (product.price || 0);
        totalRevenue += revenue;

        // Product-wise aggregation
        if (!productSales[product.name]) {
          productSales[product.name] = { quantitySold: 0, revenue: 0 };
        }
        productSales[product.name].quantitySold += item.quantity;
        productSales[product.name].revenue += revenue;

        // Supplier-wise aggregation
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
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      start,
      end,
      totalOrders,
      totalItemsSold,
      totalRevenue,
      topProducts,
      topSuppliers
    });
  } catch (error) {
    console.error("Error generating sales report:", error.message);
    res.status(500).json({ message: "Error generating sales report", error: error.message });
  }
};

// Monthly sales aggregation
const getMonthlySales = async (req, res) => {
  try {
    const { year } = req.query; // e.g. ?year=2026
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    // Aggregate by month using items.product.price
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(`${selectedYear}-01-01`),
        $lte: new Date(`${selectedYear}-12-31`)
      }
    }).populate({
      path: "items.product",
      populate: { path: "supplier", select: "name" }
    });

    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(selectedYear, i).toLocaleString("default", { month: "long" }),
      totalRevenue: 0,
      totalOrders: 0
    }));

    orders.forEach(order => {
      const monthIndex = order.createdAt.getMonth();
      monthlyTotals[monthIndex].totalOrders += 1;

      order.items.forEach(item => {
        const product = item.product;
        if (!product) return;
        const revenue = item.quantity * (product.price || 0);
        monthlyTotals[monthIndex].totalRevenue += revenue;
      });
    });

    res.json({ year: selectedYear, monthlyData: monthlyTotals });
  } catch (error) {
    console.error("Error generating monthly sales:", error.message);
    res.status(500).json({ message: "Error generating monthly sales", error: error.message });
  }
};

module.exports = { getSalesReport, getMonthlySales };