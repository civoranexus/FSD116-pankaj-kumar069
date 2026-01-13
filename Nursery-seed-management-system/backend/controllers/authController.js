const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------------------- REGISTER USER --------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Default role = "customer" if not provided
    const userRole = role || "customer"; // ← COMMENT: ye ensure karta hai ki role na mile to customer ho

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password (security improvement)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ← COMMENT: Original code me bhi hashed password tha
      role: userRole,           // ← COMMENT: Role set kar diya
    });

    // Generate JWT immediately after registration
    const token = jwt.sign(
      { id: user._id, role: user.role }, // ← COMMENT: role backend response me bhejenge, frontend use karega
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- LOGIN USER --------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password); // ← COMMENT: matches with hashed password
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT with role info
    const token = jwt.sign(
      { id: user._id, role: user.role }, // ← COMMENT: role included for frontend role-based redirect
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }, // ← COMMENT: frontend ko role bhejna
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET CURRENT USER --------------------
const getUser = async (req, res) => {
  try {
    // req.user.id comes from authMiddleware after verifying JWT
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUser };

// -------------------- COMMENTS SUMMARY --------------------
// 1. Role included in JWT and response for frontend redirect
// 2. Default role = "customer" if role not provided
// 3. Password hashed before saving
// 4. getUser method excludes password
// 5. No original code removed, only security & role-based improvements added
