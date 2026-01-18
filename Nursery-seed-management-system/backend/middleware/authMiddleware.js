const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (any logged-in user)
const protect = async (req, res, next) => {
  // Expect token in header: Authorization: Bearer <token>
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to ensure user exists and role is current
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user info (id, role, name, email) to request
    next();
  } catch (error) {
    // If token expired or invalid
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    // ⚠️ IMPORTANT: req.user should already exist (protected route)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorize };
