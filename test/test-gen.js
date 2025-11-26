import axios from 'axios';

async function testGeneration() {
    try {
        console.log("Sending generation request...");
        const response = await axios.post('http://localhost:3000/api/generate');
        console.log("Response:", response.data);

        if (response.data.success && response.data.imageUrl && response.data.tokenURI) {
            console.log("TEST PASSED: Generation successful");
        } else {
            console.log("TEST FAILED: Invalid response structure");
        }
    } catch (error) {
        console.error("TEST FAILED:", error.message);
        if (error.response) {
            console.error("Server Error:", error.response.data);
        }
    }
}

testGeneration();
