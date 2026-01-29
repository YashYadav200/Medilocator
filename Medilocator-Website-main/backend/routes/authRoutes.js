const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

console.log("Auth Routes Loaded");

router.use((req, res, next) => {
    console.log("Auth Request:", req.method, req.url);
    next();
});

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
