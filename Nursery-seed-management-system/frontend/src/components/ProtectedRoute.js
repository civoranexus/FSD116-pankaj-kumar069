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
