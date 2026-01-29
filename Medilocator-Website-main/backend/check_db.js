const mongoose = require("mongoose");
const Medicine = require("./models/Medicine");
const Vendor = require("./models/Vendor");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        const vendors = await Vendor.find({});
        console.log(`\n--- VENDORS (${vendors.length}) ---`);
        console.log(vendors.map(v => ({
            id: v._id,
            storeName: v.storeName,
            status: v.status,
            state: v.state,
            district: v.district,
            area: v.area,
            isVerified: v.isVerified
        })));

        const medicines = await Medicine.find({});
        console.log(`\n--- MEDICINES (${medicines.length}) ---`);
        console.log(medicines.map(m => ({
            id: m._id,
            name: m.name,
            quantity: m.quantity,
            vendorId: m.vendorId
        })));

        mongoose.disconnect();
    })
    .catch(err => {
        console.error("DB Connection Error:", err);
        process.exit(1);
    });
