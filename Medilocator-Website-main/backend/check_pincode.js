
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const checkPincode = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({});
        console.log("--- All Users ---");
        users.forEach(u => {
            console.log(`Name: ${u.name}, Role: ${u.role}, Email: ${u.email}, Pincode: '${u.pincode}'`);
        });

        const vendors = await Vendor.find({});
        console.log("\n--- All Vendors ---");
        vendors.forEach(v => {
            console.log(`Store: ${v.storeName}, AreaCode: '${v.areaCode}'`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkPincode();
