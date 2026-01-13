const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // password hash karne ke liye

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["staff", "customer", "admin"],
    default: "customer",
  },
}, { timestamps: true });

/* 
  Password hashing before saving user 
  - Automatically encrypts password before saving
*/
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); // agar password change nahi hua to skip

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* 
  Method to compare password during login 
*/
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
