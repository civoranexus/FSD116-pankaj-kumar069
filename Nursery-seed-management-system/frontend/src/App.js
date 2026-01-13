import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
import Orders from "./components/Orders";
import Suppliers from "./components/Suppliers";
import Procurement from "./components/Procurement";
import Health from "./components/Health";
import Admin from "./components/Admin";
import SalesReport from "./components/SalesReport";
import Dashboard from "./pages/Dashboard";

// ✅ Customer Components
import SeedList from "./components/SeedList";

// ---- PLACEHOLDERS for components not yet created ----
const SeedDetails = () => <div>Seed Details Page (Under Construction)</div>;
const Cart = () => <div>Cart Page (Under Construction)</div>;
const MyOrders = () => <div>My Orders Page (Under Construction)</div>;

// ✅ Protected Route wrapper
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // store role at login/register

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ------------------ Public routes ------------------ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ------------------ Admin / Staff Routes ------------------ */}
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
        <Route
          path="/sales-report"
          element={
            <ProtectedRoute role="admin">
              <SalesReport />
            </ProtectedRoute>
          }
        />

        {/* ------------------ Customer Routes ------------------ */}
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

        {/* ------------------ Fallback Route ------------------ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

/* -------------------- COMMENTS --------------------
1. Admin / Staff routes: Dashboard, Inventory, Orders, Suppliers, Procurement, Health, Admin, SalesReport
2. Customer routes: SeedList (/seeds), SeedDetails (/seeds/:id), Cart (/cart), MyOrders (/my-orders)
3. Placeholder components used for SeedDetails, Cart, MyOrders to prevent module not found errors
4. ProtectedRoute checks token + role
5. LocalStorage: store 'token' and 'role' at login/register
6. Fallback route redirects unknown paths to home
---------------------------------------------------- */
