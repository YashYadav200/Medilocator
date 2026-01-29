const User = require("../models/User");
const Vendor = require("../models/Vendor"); // Import Vendor Model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, pincode, ...profileData } = req.body; // Extract profile data

    // Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      pincode
    });

    // If Role is Vendor, create Vendor Profile
    if (role === 'VENDOR') {
      console.log("Creating Vendor Profile...");
      try {
        await Vendor.create({
          userId: user._id,
          storeName: profileData.storeName,
          fullName: profileData.fullName || name,
          email: profileData.email || email,
          mobile: profileData.mobile,
          address: profileData.address,
          state: profileData.state,
          district: profileData.district,
          area: profileData.area,
          areaCode: profileData.areaCode,
          storeTimings: profileData.storeTimings
        });
        console.log("Vendor Profile Created");
      } catch (vendorError) {
        console.error("Error creating Vendor Profile:", vendorError);
        // Delete user if vendor creation fails to maintain consistency?
        // For now just throw to main catch or handle gracefully
        throw vendorError;
      }
    }

    // CHECK ADMIN STATUS (New Logic)
    if (role === 'ADMIN') {
      user.status = 'PENDING';
      await user.save();
    }

    res.status(201).json({
      message: role === 'ADMIN' ? "Admin registered. Please wait for approval." : "User registered successfully",
      userId: user._id
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found via findOne");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found, checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`Password matched. Generating token. Secret exists: ${!!process.env.JWT_SECRET}`);

    // CHECK VENDOR STATUS
    if (user.role === 'VENDOR') {
      const vendor = await Vendor.findOne({ userId: user._id });
      if (!vendor) {
        return res.status(403).json({ message: "Vendor profile not found." });
      }
      if (vendor.status !== 'APPROVED') {
        console.log(`Login blocked: Vendor status is ${vendor.status}`);
        if (vendor.status === 'REJECTED') {
          return res.status(403).json({ message: "Your application has been REJECTED. Please contact support." });
        }
        return res.status(403).json({ message: `Your account is ${vendor.status}. Please wait for Admin approval.` });
      }
    }

    // CHECK ADMIN STATUS
    if (user.role === 'ADMIN') {
      if (user.status !== 'APPROVED') {
        console.log(`Login blocked: Admin status is ${user.status}`);
        if (user.status === 'REJECTED') {
          return res.status(403).json({ message: "Your Admin application has been REJECTED." });
        }
        return res.status(403).json({ message: "Your Admin account is PENDING approval." });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token generated successfully");

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let response = { ...user.toObject() };

    if (user.role === 'VENDOR') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      if (vendor) {
        response = { ...response, ...vendor.toObject(), _id: user._id }; // Ensure userId is top level id
        // Note: Vendor fields will merge. 
        // Vendor has: storeName, fullName, mobile, address, state, district, area, areaCode, storeTimings
      }
    }

    res.json(response);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, pincode, storeName, fullName, mobile, address, state, district, area, areaCode, storeTimings } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update User Model
    if (name) user.name = name;
    if (pincode !== undefined) user.pincode = pincode;

    // Email Update Logic
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    let updatedData = { ...user.toObject() };

    // Update Vendor Model if applicable
    if (user.role === 'VENDOR') {
      const vendor = await Vendor.findOne({ userId });
      if (vendor) {
        vendor.storeName = storeName || vendor.storeName;
        vendor.fullName = fullName || vendor.fullName;

        // Sync Email if updated
        if (req.body.email) vendor.email = req.body.email;

        vendor.mobile = mobile || vendor.mobile;
        vendor.address = address || vendor.address;
        vendor.state = state || vendor.state;
        vendor.district = district || vendor.district;
        vendor.area = area || vendor.area;
        vendor.areaCode = areaCode || vendor.areaCode;
        vendor.storeTimings = storeTimings || vendor.storeTimings;

        await vendor.save();
        updatedData = { ...updatedData, ...vendor.toObject(), _id: user._id };
      }
    }

    res.json(updatedData);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
