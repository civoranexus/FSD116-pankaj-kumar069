const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/procurements", require("./routes/procurementRoutes"));
app.use("/api/health", require("./routes/healthRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/sales", require("./routes/salesRoutes")); // ✅ consistent import style
app.use("/api/customers", require("./routes/customerRoutes"));

// Root route (optional health check)
app.get("/", (req, res) => {
  res.send("Nursery & Seed Management API is running...");
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));