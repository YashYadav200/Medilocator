const Vendor = require("../models/Vendor");
const Medicine = require("../models/Medicine");

exports.searchMedicine = async (req, res) => {
  try {
    const { state, district, area, medicine } = req.query;

    if (!state || !medicine) {
      return res
        .status(400)
        .json({ message: "State and Medicine are required for search" });
    }

    // Step 1: find vendors in selected location
    let vendorQuery = {
      state: { $regex: new RegExp(`^${state}$`, "i") },
      isVerified: true
    };

    if (district) {
      vendorQuery.district = { $regex: new RegExp(`^${district}$`, "i") };
    }
    if (area) {
      vendorQuery.area = { $regex: new RegExp(`^${area}$`, "i") };
    }

    const vendors = await Vendor.find(vendorQuery);

    if (vendors.length === 0) {
      return res.json({ message: "No medical stores found in this area" });
    }

    const vendorIds = vendors.map(v => v._id);

    // Step 2: find medicines from those vendors
    const medicines = await Medicine.find({
      vendorId: { $in: vendorIds },
      name: { $regex: medicine, $options: "i" }
    }).populate("vendorId", "storeName mobile address state district area areaCode");

    if (medicines.length === 0) {
      return res.json({ message: "Medicine not available" });
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { type, query } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    let results = [];
    const regex = new RegExp(query, "i");

    if (type === "state") {
      results = await Vendor.distinct("state", { state: regex, isVerified: true });
    } else if (type === "district") {
      results = await Vendor.distinct("district", { district: regex, isVerified: true });
    } else if (type === "area") {
      results = await Vendor.distinct("area", { area: regex, isVerified: true });
    } else if (type === "medicine") {
      results = await Medicine.distinct("name", { name: regex });
    }

    res.json(results.slice(0, 10)); // Limit to 10 suggestions
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
