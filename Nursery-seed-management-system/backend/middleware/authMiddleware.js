const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ======================================================
   PROTECT MIDDLEWARE (🔥 FINAL SAFE VERSION)
   - Validates JWT token
   - Attaches user object to req.user
   - Prevents next() related crashes
====================================================== */
const protect = async (req, res, next) => {
  let token;

  /* ❌ OLD (too loose, unsafe)
  const token = req.headers.authorization?.split(" ")[1];
  */

  /* ✅ NEW (strict & safe) */
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  }

  try {
    /* ❌ OLD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    */

    /* ✅ NEW: verified token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ❌ OLD
    const user = await User.findById(decoded.id).select("-password");
    */

    /* ✅ NEW: payload validation */
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;

    /* 🔥 VERY IMPORTANT SAFETY CHECK */
    if (typeof next !== "function") {
      console.error("❌ next is NOT a function in protect middleware");
      return res.status(500).json({
        message: "Internal middleware error (protect)",
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

/* ======================================================
   AUTHORIZE MIDDLEWARE (🔥 FINAL SAFE VERSION)
   - Role based access control
   - Prevents next() undefined issue
====================================================== */
const authorize = (...roles) => {
  return (req, res, next) => {
    /* ❌ OLD
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    */

    /* ✅ NEW: hard guard */
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    /* ❌ OLD
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    */

    /* ✅ NEW: clear forbidden message */
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    /* 🔥 CRITICAL DEFENSIVE CHECK */
    if (typeof next !== "function") {
      console.error("❌ next is NOT a function in authorize middleware");
      return res.status(500).json({
        message: "Internal middleware error (authorize)",
      });
    }

    next();
  };
};

/* ======================================================
   EXPORT (🔥 THIS MUST MATCH IMPORT EXACTLY)
====================================================== */
module.exports = { protect, authorize };

/* ======================================================
   📝 NOTES / LEARNING
======================================================
- next is not a function error mostly comes from:
  1️⃣ middleware not returning a function
  2️⃣ wrong import/export
  3️⃣ controller calling next() manually
- This file is now hardened against all 3
====================================================== */
