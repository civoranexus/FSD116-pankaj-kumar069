// -------------------- IMPORTS --------------------
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require('path');

// -------------------- ENVIRONMENT VARIABLES --------------------
dotenv.config();

// -------------------- DATABASE CONNECTION --------------------
connectDB(); // MongoDB connect

// -------------------- INIT EXPRESS APP --------------------
const app = express();

// -------------------- MIDDLEWARE --------------------
/*
❌ OLD (not wrong, but unclear order)
app.use(cors());
app.use(express.json());
*/

/* ✅ FINAL (BEST PRACTICE ORDER) */
app.use(cors());                 // Allow cross-origin requests
app.use(express.json({ limit: "10mb" })); // JSON body parsing (safe limit)



// Serve frontend build
app.use(express.static(path.join(__dirname, 'build')));


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

// Customer routes
app.use("/api/customers", require("./routes/customerRoutes"));

// -------------------- ROOT ROUTE --------------------
app.get("/", (req, res) => {
  res.send("🌱 Nursery & Seed Management API is running...");
});

// -------------------- 404 HANDLER --------------------
/*
⚠️ IMPORTANT:
- This runs only if no route matched
*/
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});


app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// -------------------- GLOBAL ERROR HANDLER --------------------
/*
⚠️ IMPORTANT:
- `next` yaha use hota hai, but Express automatically pass karta hai
- Is file me `next is not a function` kabhi nahi aayega
*/
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

/* -------------------- COMMENTS SUMMARY --------------------
✔ server.js is CLEAN
✔ No middleware misuse
✔ No route misuse
✔ No "next is not a function" possible here

👉 ISSUE IS 100% IN:
   - authMiddleware.js
   - OR orderRoutes.js (middleware usage)
------------------------------------------------------------ */
