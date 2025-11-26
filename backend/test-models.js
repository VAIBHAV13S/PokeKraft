import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to get client
        // There isn't a direct listModels on the instance easily accessible in all versions, 
        // but let's try a simple generation with gemini-pro to see if that works at least.

        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("gemini-pro works:", result.response.text());

    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        console.log("Testing gemini-1.0-pro...");
        const result2 = await model2.generateContent("Hello");
        console.log("gemini-1.0-pro works:", result2.response.text());
    } catch (error) {
        console.error("gemini-1.0-pro failed:", error.message);
    }
}

listModels();
