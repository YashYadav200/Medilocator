const express = require("express");
const router = express.Router();
const { searchMedicine, getSuggestions } = require("../controllers/searchController");

router.get("/medicine", searchMedicine);
router.get("/suggestions", getSuggestions);

module.exports = router;
