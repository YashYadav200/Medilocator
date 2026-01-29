const axios = require('axios');

const testRegister = async () => {
    try {
        const uniqueEmail = `test${Date.now()}@example.com`;
        console.log(`Attempting to register with email: ${uniqueEmail}`);

        const res = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
            role: 'USER',
            pincode: '123456'
        });

        console.log('Response Status:', res.status);
        console.log('Response Data:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('Error Response:', err.response.status, err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
};

testRegister();
