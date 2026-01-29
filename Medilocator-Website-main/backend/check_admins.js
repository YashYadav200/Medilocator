const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const admins = await User.find({ role: 'ADMIN' });
        console.log("\n--- ALL ADMINS ---");
        admins.forEach(a => {
            console.log(`ID: ${a._id}, Name: ${a.name}, Email: ${a.email}, Status: ${a.status}`);
        });
        console.log("------------------\n");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkAdmins();
