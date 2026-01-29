const mongoose = require("mongoose");
const Vendor = require("./models/Vendor");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        const result = await Vendor.updateMany(
            { state: "Maharastra" },
            { $set: { state: "Maharashtra" } }
        );

        console.log("Update result:", result);
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
