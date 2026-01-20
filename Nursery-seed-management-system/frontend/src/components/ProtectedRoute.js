import React from "react";
import { Navigate } from "react-router-dom";

/*
===========================================================
ProtectedRoute (Role Based)
-----------------------------------------------------------
- If user is not logged in -> redirect to /login
- If allowedRoles is passed -> only those roles can access
- If not allowed -> redirect to /unauthorized
===========================================================
*/
const ProtectedRoute = ({ children, allowedRoles }) => {
  // 🔐 Auth data
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ STEP 1: User logged in nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ STEP 2: Role allowed nahi hai
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ STEP 3: Sab sahi hai
  return children;
};

export default ProtectedRoute;

/* ===================== OLD CODE (COMMENTED) =====================

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is passed (like admin-only)
  if (role && userRole !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;

================================================================== */
