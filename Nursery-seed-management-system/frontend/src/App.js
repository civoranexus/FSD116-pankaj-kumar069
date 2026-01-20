import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import SeedList from "./components/SeedList";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import SalesReport from "./pages/admin/SalesReport";
import Suppliers from "./pages/admin/Suppliers";
import Procurement from "./pages/admin/Procurement";
import Health from "./pages/admin/Health";
import Staff from "./pages/admin/Staff";

// ✅ Unauthorized Page
import Unauthorized from "./pages/Unauthorized";

// ---- PLACEHOLDERS ----
// (Temporary placeholders for pages not created yet)
const SeedDetails = () => <div>Seed Details Page</div>;
const Cart = () => <div>Cart Page</div>;
const MyOrders = () => <div>My Orders Page</div>;

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Dashboard (ALL logged-in users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin + Staff */}
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

        {/* Admin Only */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
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

        {/* Staff Only */}
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

        {/* Customer Only */}
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
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
