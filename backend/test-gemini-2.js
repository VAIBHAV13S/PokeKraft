import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testGeminiImage() {
    console.log("Testing Gemini 2.0 Image Generation...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use the specific image generation model found in the list
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    // Note: Sometimes image generation is part of the main model or a specific one.
    // The list showed "models/gemini-2.0-flash-exp-image-generation".
    // Let's try that specific model name first.

    try {
        const imageModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = "A cute electric type pokemon, 3d render, high quality";
        console.log("Sending prompt:", prompt);

        const result = await imageModel.generateContent(prompt);
        const response = result.response;

        console.log("Response received.");
        // console.log(JSON.stringify(response, null, 2));

        // Check for images in the response
        // The SDK usually handles this via inlineData or similar if it's multimodal return
        // But for Imagen/Gemini image gen, it might be different.

        // Let's inspect the candidates
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            const parts = candidate.content.parts;

            let imageFound = false;
            for (const part of parts) {
                if (part.inlineData) {
                    console.log("Found inline image data!");
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    fs.writeFileSync('gemini-2.0-test.png', buffer);
                    console.log("✅ Saved to gemini-2.0-test.png");
                    imageFound = true;
                }
            }

            if (!imageFound) {
                console.log("No image data found in response parts.");
                console.log("Text response:", response.text());
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testGeminiImage();
