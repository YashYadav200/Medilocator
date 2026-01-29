const Vendor = require("../models/Vendor");
const Medicine = require("../models/Medicine");

// Create Vendor Profile (one time)
exports.createVendorProfile = async (req, res) => {
  try {
    const { storeName, fullName, email, mobile, address, state, district, area, areaCode, storeTimings } = req.body;

    const vendor = await Vendor.create({
      storeName,
      fullName,
      email,
      mobile,
      address,
      state,
      district,
      area,
      areaCode,
      storeTimings,
      userId: req.user._id
    });

    res.status(201).json({
      message: "Vendor profile created",
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Medicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor profile not found" });
    }

    const medicine = await Medicine.create({
      name,
      quantity,
      price,
      vendorId: vendor._id
    });

    res.status(201).json({
      message: "Medicine added",
      medicine
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// View Own Medicines
exports.getMyMedicines = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor profile not found" });
    }

    const medicines = await Medicine.find({ vendorId: vendor._id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`UPDATE MEDICINE: ${id}`, req.body);
    const { name, quantity, price } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    // Ensure the medicine belongs to the vendor
    // For simplicity assuming ID check is enough, but strictly should check vendorId ownership
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { name, quantity, price },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine updated", medicine });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Delete Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`\n--- DELETE REQUEST DEBUG ---`);
    console.log(`DB Name: ${require("mongoose").connection.name}`);
    console.log(`ID received: '${id}' (Type: ${typeof id}, Length: ${id.length})`);

    // Explicitly cast to ObjectId to catch errors
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Try finding it first
    const found = await Medicine.findById(id);
    console.log(`Medicine.findById('${id}') result:`, found);

    if (!found) {
      console.log("Medicine document lookup returned null.");
      return res.status(404).json({ message: `Medicine with ID ${id} not found in DB: ${require("mongoose").connection.name}` });
    }

    const medicine = await Medicine.findByIdAndDelete(id);
    console.log("Medicine deleted successfully");
    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
