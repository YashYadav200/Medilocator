
const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const checkVendorDetails = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const vendors = await Vendor.find({});
        console.log(`Found ${vendors.length} vendors.`);

        vendors.forEach(v => {
            console.log("\n---------------------------------------------------");
            console.log(`Store Name: ${v.storeName}`);
            console.log(`Mobile: '${v.mobile}'`);
            console.log(`Address: '${v.address}'`);
            console.log(`State: '${v.state}'`);
            console.log(`District: '${v.district}'`);
            console.log(`Area: '${v.area}'`);
            console.log(`Area Code: '${v.areaCode}'`);
            console.log("---------------------------------------------------\n");
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkVendorDetails();
