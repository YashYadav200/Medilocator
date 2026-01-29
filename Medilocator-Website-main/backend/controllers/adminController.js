const Vendor = require("../models/Vendor");
const User = require("../models/User");

// Get all pending verification requests
// Get vendors (filter by status if query param provided)
exports.getAllVendors = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'ALL') {
            query.status = status;
        }
        const vendors = await Vendor.find(query).populate("userId", "name email");
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all admins
// Get all admins (Supports status filtering)
exports.getAllAdmins = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { role: 'ADMIN' };

        if (status && status !== 'ALL') {
            query.status = status;
        }

        const admins = await User.find(query).select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Email Logic
const nodemailer = require("nodemailer");

const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email Error:", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

// Accept Vendor
exports.acceptVendor = async (req, res) => {
    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "APPROVED";
        vendor.isVerified = true;
        await vendor.save();

        // Send Email
        sendEmail(
            vendor.email,
            "Vendor Application Approved - MediLocator",
            `Hello ${vendor.storeName},\n\nYour application has been APPROVED by the Admin.\n\nYou can now login to your dashboard and manage your medicines.\n\nThank you,\nMediLocator Team`
        );

        res.json({ message: "Vendor approved successfully", vendor });
    } catch (error) {
        console.error("ACCEPT VENDOR ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Reject Vendor
exports.rejectVendor = async (req, res) => {
    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.status = "REJECTED";
        vendor.isVerified = false;
        await vendor.save();

        res.json({ message: "Vendor rejected", vendor });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// --- ADMIN APPROVAL LOGIC ---

// Get pending admin requests
// Get pending admin requests
exports.getAdminRequests = async (req, res) => {
    try {
        const { status } = req.query; // PENDING, APPROVED, REJECTED
        console.log("[DEBUG] getAdminRequests called. Query Status:", status);
        const query = { role: 'ADMIN' };

        if (status && status !== 'ALL') {
            query.status = status;
        }

        console.log("[DEBUG] User Query:", JSON.stringify(query));

        const admins = await User.find(query).select('-password');
        console.log(`[DEBUG] Found ${admins.length} admins.`);
        res.json(admins);
    } catch (error) {
        console.error("[DEBUG] getAdminRequests Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve Admin
exports.approveAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await User.findOne({ _id: adminId, role: 'ADMIN' });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.status = "APPROVED";
        await admin.save();

        res.json({ message: "Admin approved successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reject Admin
exports.rejectAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await User.findOne({ _id: adminId, role: 'ADMIN' });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.status = "REJECTED";
        await admin.save();

        res.json({ message: "Admin rejected", admin });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
