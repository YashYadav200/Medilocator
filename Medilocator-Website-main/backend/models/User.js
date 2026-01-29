const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["USER", "VENDOR", "ADMIN"],
      default: "USER"
    },
    pincode: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "APPROVED" // Default to APPROVED for backward compatibility
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
