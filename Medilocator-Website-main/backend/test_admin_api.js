const express = require('express');
const adminRoutes = require('./routes/adminRoutes'); // Correct relative path from backend/
const request = require('http');

console.log('--- Starting Admin API Test ---');

const app = express();
app.use(express.json());

// Mock middleware to bypass auth
app.use((req, res, next) => {
    req.user = { role: 'ADMIN' }; // Mock admin user
    next();
});

// Mock protect/adminOnly middleware locally if needed, but adminRoutes uses require()
// Since adminRoutes requires middleware from ../middleware/authMiddleware, we rely on that file existing.
// However, we need to mock the functions if we want to bypass database calls in the middleware?
// The actual middleware does:
// 1. Verify token
// 2. Fetch user from DB
// 
// If we run this script, it will fail at DB connection or Token verification if we don't mock it.
// To reliably test the ROUTING (404 vs 200/500), we should try to mock the middleware require.
// But we can't easily mock require in a simple script without tools.

// Alternative: We just rely on the router object inspection? No, we did that.
// Let's try to mock the whole app but we accept that it might fail with 500 or 401.
// 401 or 500 means the route MATCHED (so not 404).
// 404 means route didn't match.

app.use('/api/admin', adminRoutes);

const server = app.listen(5999, () => {
    console.log('Test server running on 5999');

    // Make request
    const options = {
        hostname: 'localhost',
        port: 5999,
        path: '/api/admin/admins',
        method: 'GET',
        headers: {
            // No auth header, so expect 401
        }
    };

    const req = request.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.on('data', (d) => {
            console.log('BODY:', d.toString());
        });
        server.close();

        if (res.statusCode === 404) {
            console.log("FAIL: Route returned 404 Not Found");
            process.exit(1);
        } else {
            console.log("PASS: Route found (even if 401/500)");
            process.exit(0);
        }
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        server.close();
    });

    req.end();
});
