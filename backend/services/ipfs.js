import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export async function uploadToIPFS(imagePathOrUrl) {
    try {
        let fileStream;
        let filename = 'pokemon.png';

        // Check if it's a local file path or URL
        if (imagePathOrUrl.startsWith('http://') || imagePathOrUrl.startsWith('https://')) {
            // It's a URL - download it
            const response = await axios.get(imagePathOrUrl, { responseType: 'stream' });
            fileStream = response.data;
        } else {
            // It's a local file path - read it
            const fs = await import('fs');
            fileStream = fs.createReadStream(imagePathOrUrl);
            filename = imagePathOrUrl.split(/[\\\/]/).pop(); // Get filename from path
        }

        // Create form data
        const data = new FormData();
        data.append('file', fileStream, { filename });

        // Upload to Pinata
        const res = await axios.post(PINATA_API_URL, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                ...data.getHeaders()
            }
        });

        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading image to IPFS:", error);
        throw error;
    }
}

export async function uploadMetadata(metadata) {
    try {
        const data = JSON.stringify({
            pinataOptions: {
                cidVersion: 1
            },
            pinataMetadata: {
                name: `${metadata.name}.json`
            },
            pinataContent: metadata
        });

        const res = await axios.post(PINATA_JSON_URL, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });

        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading metadata to IPFS:", error);
        throw error;
    }
}
