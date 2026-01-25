import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   COMMON COMPONENTS
========================= */
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
   CUSTOMER PAGES
========================= */
import SeedList from "./components/SeedList";

/*
❌ OLD PLACEHOLDERS (kept for reference)
const SeedDetails = () => <div>Seed Details Page</div>;
const Cart = () => <div>Cart Page</div>;
const MyOrders = () => <div>My Orders Page</div>;
*/

// ✅ NEW REAL CUSTOMER PAGES
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/Checkout";
import SeedDetails from "./components/SeedDetails";

/* =========================
   ADMIN / STAFF PAGES
========================= */
import Orders from "./pages/Orders";

import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import SalesReport from "./pages/admin/SalesReport";
import Suppliers from "./pages/admin/Suppliers";
import Procurement from "./pages/admin/Procurement";
import Health from "./pages/admin/Health";
import Staff from "./pages/admin/Staff";
import PlaceOrder from "./pages/PlaceOrder";

function App() {
  return (
    <Router>
      {/* Navbar visible on all pages */}
      <Navbar />

      <Routes>
        {/* ========================
            PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ========================
            COMMON DASHBOARD
            (All logged-in users)
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
