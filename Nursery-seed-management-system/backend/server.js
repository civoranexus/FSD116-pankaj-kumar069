const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const salesRoutes = require("./routes/salesRoutes");

dotenv.config();
connectDB();

const app = express();
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
app.use("/api/sales", salesRoutes);
app.use("/api/customers", require("./routes/customerRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));