import axios from 'axios';

async function testEndpoints() {
    try {
        // 1. Test Mint Endpoint
        console.log("Testing /api/mint...");
        const mintResponse = await axios.post('http://localhost:3000/api/mint', {
            tokenId: 1,
            ownerAddress: '0x123',
            metadata: {
                name: 'TestMon',
                image: 'ipfs://test'
            },
            traits: {
                type: 'Fire',
                element: 'Flame',
                tier: 'Common',
                style: 'Pixel',
                stats: { hp: 10, attack: 10, defense: 10, speed: 10 }
            }
        });
        console.log("Mint Response:", mintResponse.data);

        // 2. Test Gallery Endpoint
        console.log("Testing /api/gallery...");
        const galleryResponse = await axios.get('http://localhost:3000/api/gallery');
        console.log("Gallery Response:", galleryResponse.data);

        if (galleryResponse.data.pokemon.length > 0) {
            console.log("TEST PASSED: Endpoints working");
        } else {
            console.log("TEST FAILED: No pokemon found in gallery");
        }

    } catch (error) {
        console.error("TEST FAILED:", error.message);
        if (error.response) {
            console.error("Server Error:", error.response.data);
        }
    }
}

testEndpoints();
