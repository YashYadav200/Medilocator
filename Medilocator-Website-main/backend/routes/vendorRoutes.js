const express = require("express");
const router = express.Router();
const {
  createVendorProfile,
  addMedicine,
  getMyMedicines,
  updateMedicine,
  deleteMedicine
} = require("../controllers/vendorController");

const { protect, vendorOnly } = require("../middleware/authMiddleware");

router.post("/create-profile", protect, vendorOnly, createVendorProfile);
router.post("/add-medicine", protect, vendorOnly, addMedicine);
router.get("/my-medicines", protect, vendorOnly, getMyMedicines);
router.put("/update-medicine/:id", protect, vendorOnly, updateMedicine);
router.delete("/delete-medicine/:id", protect, vendorOnly, deleteMedicine);

module.exports = router;
