const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const adminController = require('./controllers/adminController');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// Mock request/response
app.get('/test-admins', adminController.getAllAdmins);

const testFilter = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        // Test Query: REJECTED
        const req = { query: { status: 'REJECTED' } };
        const res = {
            json: (data) => {
                console.log("\n--- Filtering by REJECTED ---");
                console.log(`Found ${data.length} records.`);
                data.forEach(d => console.log(`- ${d.name} (${d.status})`));
            },
            status: (code) => ({ json: (d) => console.log("Error:", code, d) })
        };

        await adminController.getAllAdmins(req, res);

        // Test Query: APPROVED
        const req2 = { query: { status: 'APPROVED' } };
        const res2 = {
            json: (data) => {
                console.log("\n--- Filtering by APPROVED ---");
                console.log(`Found ${data.length} records.`);
                data.forEach(d => console.log(`- ${d.name} (${d.status})`));
            },
            status: (code) => ({ json: (d) => console.log("Error:", code, d) })
        };

        await adminController.getAllAdmins(req2, res2);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testFilter();
