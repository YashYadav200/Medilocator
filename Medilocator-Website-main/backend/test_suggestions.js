const mongoose = require("mongoose");
const Vendor = require("./models/Vendor");
const Medicine = require("./models/Medicine");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        const query = "Ma";
        const regex = new RegExp(query, "i");

        console.log(`Testing State Suggestion for query: "${query}"`);
        const states = await Vendor.distinct("state", { state: regex, isVerified: true });
        console.log("States found:", states);

        console.log(`Testing District Suggestion for query: "Pu"`);
        const districts = await Vendor.distinct("district", { district: /Pu/i, isVerified: true });
        console.log("Districts found:", districts);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
