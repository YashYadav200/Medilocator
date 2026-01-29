const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true
    },
    fullName: { // New Field
      type: String,
      required: true
    },
    email: { // New Field
      type: String,
      required: true
    },
    mobile: { // New Field
      type: String,
      required: true
    },
    address: { // New Field
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    areaCode: { // New Field
      type: String,
      required: true
    },
    storeTimings: { // New Field: Opening Hours
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
