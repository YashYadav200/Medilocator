const express = require("express");
const router = express.Router();
const { getAllVendors, acceptVendor, rejectVendor, getAllAdmins, approveAdmin, rejectAdmin } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Route to get vendors (accepts ?status=QUERY)
// Route to get all admins (Merged logic: defaults to all if no status, or filtered by status)
router.get("/admins", protect, adminOnly, getAllAdmins);

router.post("/verify-admin/:id", protect, adminOnly, approveAdmin);

router.post("/reject-admin/:id", protect, adminOnly, rejectAdmin);

// Legacy routes...
router.get("/vendors", protect, adminOnly, getAllVendors);
router.post("/verify/:id", protect, adminOnly, acceptVendor);
router.post("/reject/:id", protect, adminOnly, rejectVendor);

module.exports = router;
