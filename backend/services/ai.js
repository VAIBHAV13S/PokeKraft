import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generatePokemonImage(traits) {
    // Use the optimized prompt from Gemini if available, otherwise build one
    const prompt = traits.prompt || buildPrompt(traits);
    console.log("Generating with Pollinations.ai (Free)...");
    console.log("Prompt:", prompt);

    try {
        // Pollinations.ai - completely free, no API key needed
        // Encode prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);

        // Add negative prompt and quality settings
        const negativePrompt = encodeURIComponent("blurry, low quality, distorted, ugly, bad anatomy, text, watermark");

        // Pollinations URL with enhanced settings
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Date.now()}&model=flux&nologo=true&enhance=true`;

        console.log("Fetching from Pollinations...");

        // Download the image
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
        });

        const buffer = Buffer.from(response.data);

        // Save temporarily
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const timestamp = Date.now();
        const filename = `pokemon_${timestamp}.png`;
        const filepath = path.join(tempDir, filename);

        fs.writeFileSync(filepath, buffer);
        console.log("✅ AI Image generated with Pollinations!");
        console.log("   Saved to:", filepath);
        console.log("   Size:", (buffer.length / 1024).toFixed(1), "KB");

        return filepath;

    } catch (error) {
        console.error("Pollinations generation failed:", error.message);

        // Fallback to PokeAPI
        console.log("Using PokeAPI fallback...");
        const randomPokemonId = Math.floor(Math.random() * 150) + 1;
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemonId}.png`;
    }
}

function buildPrompt(traits) {
    const { type, element, tier, style } = traits;

    // Build a detailed prompt for better quality
    const basePrompt = `A ${tier.toLowerCase()} tier ${type.toLowerCase()} type pokemon creature`;
    const elementDesc = `with ${element.toLowerCase()} elemental powers`;
    const styleDesc = style.toLowerCase();
    const quality = "high quality, detailed digital art, professional pokemon artwork, vibrant colors, sharp focus";

    return `${basePrompt} ${elementDesc}, ${styleDesc} style, ${quality}`;
}
