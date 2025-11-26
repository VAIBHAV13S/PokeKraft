import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use the experimental 2.0 model which the user has access to
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function enhancePokemonConcept(baseTraits) {
    try {
        console.log("Enhancing concept with Gemini 2.0...");
        const prompt = `
        You are a creative director for a high-end Pokemon trading card game.
        
        I have some basic traits for a new Pokemon:
        - Type: ${baseTraits.type}
        - Element: ${baseTraits.element}
        - Rarity Tier: ${baseTraits.tier}
        - Art Style: ${baseTraits.style}
        
        Please generate a unique, creative concept for this Pokemon.
        Return ONLY a JSON object with the following structure (no markdown, no code blocks):
        {
            "name": "A unique, cool name (not just combining words)",
            "description": "A compelling 2-sentence lore description",
            "visualPrompt": "A highly detailed, artistic image generation prompt optimized for Stable Diffusion/FLUX. Describe lighting, composition, texture, and specific physical details.",
            "stats": {
                "hp": number (50-255 based on tier),
                "attack": number (50-255),
                "defense": number (50-255),
                "speed": number (50-255)
            },
            "valuation": number (estimated market value in USD, 100-10000 based on rarity),
            "grade": "string (e.g. 'Gem Mint 10', 'Pristine 10', 'Mint 9')"
        }
        `;

        // Add simple retry logic for 429 errors
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (e) {
            if (e.message.includes('429')) {
                console.log("Hit rate limit, waiting 5s...");
                await new Promise(r => setTimeout(r, 5000));
                result = await model.generateContent(prompt);
            } else {
                throw e;
            }
        }

        const response = result.response;
        const text = response.text();

        // Clean up markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return data;
    } catch (error) {
        console.error("Gemini enhancement failed:", error.message);

        // Smart Local Fallback
        // Generate better stats based on tier
        const tierMultipliers = {
            'Common': 0.8,
            'Rare': 1.0,
            'Epic': 1.2,
            'Legendary': 1.5,
            'Mythical': 1.8
        };
        const mult = tierMultipliers[baseTraits.tier] || 1.0;

        const stats = {
            hp: Math.floor((Math.random() * 50 + 50) * mult),
            attack: Math.floor((Math.random() * 50 + 50) * mult),
            defense: Math.floor((Math.random() * 50 + 50) * mult),
            speed: Math.floor((Math.random() * 50 + 50) * mult)
        };

        // Better name generation
        const suffixes = ['or', 'ax', 'on', 'ia', 'us', 'ra', 'go'];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const name = `${baseTraits.element}${baseTraits.type.substring(0, 3)}${suffix}`;

        return {
            name: name,
            description: `A ${baseTraits.tier} ${baseTraits.type}-type Pokémon wielding the ancient power of ${baseTraits.element}. It is known for its ${baseTraits.style} appearance.`,
            visualPrompt: `A ${baseTraits.tier} ${baseTraits.type} pokemon creature with ${baseTraits.element} elemental powers, ${baseTraits.style} art style, masterpiece, best quality, highly detailed, dynamic lighting, 8k resolution`,
            stats: stats,
            valuation: Math.floor(Math.random() * 1000 * mult) + 100,
            grade: Math.random() > 0.8 ? "Gem Mint 10" : "Mint 9"
        };
    }
}
