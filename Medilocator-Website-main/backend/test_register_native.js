const http = require('http');

const testRegister = () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    console.log(`Attempting to register with email: ${uniqueEmail}`);

    const postData = JSON.stringify({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
        role: 'USER',
        pincode: '123456'
    });

    const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('BODY:', data);
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

testRegister();
