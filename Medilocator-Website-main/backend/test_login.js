const axios = require('axios');

async function testLogin() {
    try {
        console.log("Attempting login to http://127.0.0.1:5000/api/auth/login...");
        const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log("Response:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Server responded with:", error.response.status, error.response.data);
        } else {
            console.log("Network/Client Error:", error.message);
        }
    }
}

testLogin();
