const express = require('express');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use('/api/admin', adminRoutes);

console.log("Checking Admin Routes...");
const router = adminRoutes;

let found = false;
router.stack.forEach(layer => {
    if (layer.route) {
        console.log(`Route found: ${layer.route.path} methods: ${Object.keys(layer.route.methods)}`);
        if (layer.route.path === '/admins') {
            found = true;
        }
    }
});

if (found) {
    console.log("SUCCESS: /admins route is registered.");
} else {
    console.log("ERROR: /admins route NOT found in router stack.");
}
