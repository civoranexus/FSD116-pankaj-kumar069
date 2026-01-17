import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import SeedList from "./components/SeedList";

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

// ✅ New Import: Staff Dashboard
import Staff from "./pages/admin/Staff"; // <-- added

// ---- PLACEHOLDERS ----
// (Temporary placeholders for pages not created yet)
const SeedDetails = () => <div>Seed Details Page</div>;
const Cart = () => <div>Cart Page</div>;
const MyOrders = () => <div>My Orders Page</div>;

// ✅ Protected Route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not logged in
  if (!token) return <Navigate to="/login" replace />;

  // If role is passed (like admin-only)
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin / Staff */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute role="admin">
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/procurements"
          element={
            <ProtectedRoute role="staff">
              <Procurement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <Health />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Sales Report Route */}
        <Route
          path="/sales-report"
          element={
            <ProtectedRoute role="admin">
              <SalesReport />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Staff Dashboard Route */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <Staff />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/seeds"
          element={
            <ProtectedRoute role="customer">
              <SeedList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seeds/:id"
          element={
            <ProtectedRoute role="customer">
              <SeedDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="customer">
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
