const express = require("express");
const router = express.Router();
const { contactSupport } = require("../controllers/supportController");

router.post("/contact", contactSupport);

module.exports = router;
