const express = require('express');
const adminRoutes = require('./routes/adminRoutes');

console.log("Checking Admin Verification Route...");
const router = adminRoutes;

let found = false;
router.stack.forEach(layer => {
    if (layer.route) {
        console.log(`Route found: ${layer.route.path} methods: ${Object.keys(layer.route.methods)}`);
        if (layer.route.path === '/verify-admin/:id' && layer.route.methods.post) {
            found = true;
        }
    }
});

if (found) {
    console.log("SUCCESS: /verify-admin/:id POST route is registered.");
} else {
    console.log("ERROR: /verify-admin/:id POST route NOT found.");
}
