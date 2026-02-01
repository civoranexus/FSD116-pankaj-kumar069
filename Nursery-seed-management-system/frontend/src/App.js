import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   COMMON / LAYOUT COMPONENTS
========================= */
// ❌ OLD (before structure cleanup)
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";

// ✅ NEW (after structure cleanup)
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


/* =========================
   PUBLIC PAGES
========================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

/* =========================
   CUSTOMER COMPONENTS
========================= */
import SeedList from "./components/SeedList";
import SeedDetails from "./components/SeedDetails";

/*
❌ OLD CUSTOMER PAGE IMPORTS (deleted files)
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import MyOrder from "./pages/MyOrder";
*/

// ✅ NEW CUSTOMER PAGES (role-based folders)
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import PlaceOrder from "./pages/PlaceOrder";


/* =========================
   ADMIN PAGES
========================= */
import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import SalesReport from "./pages/admin/SalesReport";
import Suppliers from "./pages/admin/Suppliers";
import Procurement from "./pages/admin/Procurement";
import Health from "./pages/admin/Health";
import Staff from "./pages/admin/Staff";
import Orders from "./pages/staff/Orders";

/* =========================
   STAFF PAGES
========================= */



function App() {
  return (
    <Router>
      {/* 🔹 Navbar visible on all pages */}
      <Navbar />

      <Routes>
        {/* ========================
            PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ========================
            COMMON DASHBOARD
            (Admin + Staff + Customer)
        ========================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ========================
            ADMIN + STAFF ROUTES
        ========================= */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/health"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Health />
            </ProtectedRoute>
          }
        />

        {/* ========================
            ADMIN ONLY ROUTES
        ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-report"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SalesReport />
            </ProtectedRoute>
          }
        />

        {/* ========================
            STAFF ONLY ROUTES
        ========================= */}
        <Route
          path="/procurements"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <Procurement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <Staff />
            </ProtectedRoute>
          }
        />

        {/* ========================
            CUSTOMER ONLY ROUTES
        ========================= */}
        <Route
          path="/seeds"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <SeedList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seeds/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <SeedDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/place-order"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />

        {/* ========================
            FALLBACK ROUTE
        ========================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
