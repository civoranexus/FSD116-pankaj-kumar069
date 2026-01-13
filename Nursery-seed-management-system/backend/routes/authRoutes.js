const express = require("express");
const router = express.Router();

// -------------------- Controllers --------------------
const { registerUser, loginUser, getUser } = require("../controllers/authController");

// -------------------- Middleware --------------------
const { protect } = require("../middleware/authMiddleware"); 
// protect middleware ensures JWT token verification
// only logged-in users can access protected routes

// -------------------- REGISTER --------------------
// POST /api/auth/register
// Body: { name, email, password, role(optional) }
// role is optional, default = "customer"
router.post("/register", registerUser);

// -------------------- LOGIN --------------------
// POST /api/auth/login
// Body: { email, password }
// Returns: JWT token + user info (including role)
router.post("/login", loginUser);

// -------------------- GET CURRENT USER --------------------
// GET /api/auth/user
// Protected route: JWT token required
// Returns current user profile (excluding password)
router.get("/user", protect, getUser);

// -------------------- EXPORT ROUTER --------------------
module.exports = router;

// -------------------- COMMENTS SUMMARY --------------------
// 1. register route: creates new user, default role = customer
// 2. login route: authenticates user, returns token + role
// 3. get current user route: returns profile for logged-in user
// 4. protect middleware: ensures only authenticated users can access /user
// 5. No original code removed, only comments & clarity added
