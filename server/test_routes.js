const axios = require('axios');

async function testRegister() {
    try {
        console.log("Testing POST http://localhost:5000/api/auth/register");
        // Sending invalid data just to check if route exists (expecting 400, not 404)
        await axios.post('http://localhost:5000/api/auth/register', {
            username: 'test',
            email: 'test@test.com'
            // Missing password to trigger 400
        });
    } catch (error) {
        if (error.response) {
            console.log(`Response Status: ${error.response.status}`);
            console.log(`Response Data: ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 404) {
                console.error("FAIL: Endpoint not found (404)");
                process.exit(1);
            } else if (error.response.status === 400) {
                console.log("SUCCESS: Route exists (Got 400 as expected for incomplete data)");
                process.exit(0);
            }
        } else {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}

testRegister();
