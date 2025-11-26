import dotenv from 'dotenv';
dotenv.config();

async function checkKey() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No key found");
        return;
    }
    console.log("Checking key: " + key.substring(0, 5) + "...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ API Key works! Available models:");
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log("❌ Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.log("❌ Exception:", e.message);
    }
}

checkKey();
