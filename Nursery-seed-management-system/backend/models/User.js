const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// -------------------- USER SCHEMA --------------------
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// -------------------- HASH PASSWORD BEFORE SAVE --------------------
// IMPORTANT:
// ✔ Uses async middleware
// ✔ NO next() (prevents "next is not a function" error)
// ✔ Runs only when password is modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// -------------------- MATCH PASSWORD METHOD --------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// -------------------- EXPORT MODEL --------------------
module.exports = mongoose.model("User", userSchema);
