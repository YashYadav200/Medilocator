const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const updateAdminStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find all admins without a status or PENDING status that should be approved (migration)
        // Since we are adding the field just now, existing admins might not have it or it will be default APPROVED
        // But to be safe, we explicitly set all existing admins to APPROVED to avoid lockout.
        const res = await User.updateMany(
            { role: 'ADMIN', status: { $ne: 'REJECTED' } }, // Update all except rejected
            { $set: { status: 'APPROVED' } }
        );

        console.log(`Updated ${res.modifiedCount} admins to APPROVED status.`);
        process.exit();
    } catch (error) {
        console.error("Migration Error:", error);
        process.exit(1);
    }
};

updateAdminStatus();
