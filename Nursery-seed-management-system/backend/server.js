// -------------------- IMPORTS --------------------
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// -------------------- ENVIRONMENT VARIABLES --------------------
dotenv.config();

// -------------------- DATABASE CONNECTION --------------------
connectDB(); // MongoDB connect

// -------------------- INIT EXPRESS APP --------------------
const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());          // Frontend requests allow karne ke liye
app.use(express.json());  // JSON body parsing for POST/PUT requests

// -------------------- ROUTES --------------------
// Auth routes: register, login, getUser
app.use("/api/auth", require("./routes/authRoutes"));

// Inventory routes: seeds/products
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Orders routes: customer/admin orders
app.use("/api/orders", require("./routes/orderRoutes"));

// Supplier routes
app.use("/api/suppliers", require("./routes/supplierRoutes"));

// Procurement routes
app.use("/api/procurements", require("./routes/procurementRoutes"));

// Health routes: plant health tracking
app.use("/api/health", require("./routes/healthRoutes"));

// Admin routes: admin dashboard operations
app.use("/api/admin", require("./routes/adminRoutes"));

// Sales routes
app.use("/api/sales", require("./routes/salesRoutes"));

// Customer routes (if separate APIs for customer)
app.use("/api/customers", require("./routes/customerRoutes"));

// -------------------- ROOT ROUTE --------------------
// Optional health check endpoint
app.get("/", (req, res) => {
  res.send("🌱 Nursery & Seed Management API is running...");
});

// -------------------- ERROR HANDLING --------------------
// 404 route handler (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// General error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

/* -------------------- COMMENTS SUMMARY --------------------
1. connectDB(): MongoDB connect (config/db.js)
2. cors + express.json(): frontend requests aur JSON parsing
3. All API routes added: auth, inventory, orders, suppliers, procurements, health, admin, sales, customers
4. Root route: optional health check
5. 404 + error handler added
6. Server port: env.PORT or 5000
7. No original code removed, only comments + clarity added
------------------------------------------------------------ */
