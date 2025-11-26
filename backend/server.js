import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateRandomTraits } from './utils/traits.js';
import { generatePokemonImage } from './services/ai.js';
import { uploadToIPFS, uploadMetadata } from './services/ipfs.js';
import { enhancePokemonConcept } from './services/gemini.js';
import { PokemonModel } from './models/pokemon.js';
import db from './db/index.js';

dotenv.config();

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        element TEXT NOT NULL,
        tier TEXT NOT NULL,
        style TEXT NOT NULL,
        hp INTEGER NOT NULL,
        attack INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        speed INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        ipfs_uri TEXT NOT NULL,
        owner_address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Database initialized');
});

// Database connection error handler
db.on('error', (err) => {
    console.error('Database error:', err);
});

const app = express();
const PORT = process.env.PORT || 3000;
// First, let's add detailed CORS logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('Request Headers:', req.headers);
  next();
});

// Update CORS options to be more permissive for debugging
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://poke-kraft.vercel.app'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy blocks this domain: ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS with the updated options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Add CORS headers manually for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(express.json());

app.get('/', (req, res) => {
    res.send('PokeCraft API is running');
});

app.post('/api/generate', async (req, res) => {
    try {
        console.log("Starting generation process...");

        // 1. Generate Basic Traits (Seeds)
        const baseTraits = generateRandomTraits();
        console.log("Base traits:", baseTraits);

        // 2. Enhance with Gemini (Name, Lore, Stats, Prompt)
        const enhancedData = await enhancePokemonConcept(baseTraits);
        console.log("Gemini enhanced data:", enhancedData);

        // Merge traits
        const finalTraits = {
            ...baseTraits,
            ...enhancedData,
            // Ensure stats structure matches what frontend expects
            stats: enhancedData.stats
        };

        // 3. Generate Image (AI) using Gemini's optimized prompt
        // We pass the full object, but ai.js will need to be updated to use 'visualPrompt' if available
        const imageUrl = await generatePokemonImage({
            ...finalTraits,
            prompt: enhancedData.visualPrompt // Pass the optimized prompt
        });
        console.log("Image generated:", imageUrl);

        // 4. Upload Image to IPFS
        const imageURI = await uploadToIPFS(imageUrl);
        console.log("Image uploaded to IPFS:", imageURI);

        // 5. Create Metadata
        const metadata = {
            name: finalTraits.name,
            description: finalTraits.description,
            image: imageURI,
            attributes: [
                { trait_type: "Type", value: finalTraits.type },
                { trait_type: "Element", value: finalTraits.element },
                { trait_type: "Tier", value: finalTraits.tier },
                { trait_type: "Style", value: finalTraits.style },
                { trait_type: "HP", value: finalTraits.stats.hp },
                { trait_type: "Attack", value: finalTraits.stats.attack },
                { trait_type: "Defense", value: finalTraits.stats.defense },
                { trait_type: "Speed", value: finalTraits.stats.speed },
                { trait_type: "Valuation", value: finalTraits.valuation },
                { trait_type: "Grade", value: finalTraits.grade }
            ]
        };

        // 6. Upload Metadata to IPFS
        const tokenURI = await uploadMetadata(metadata);
        console.log("Metadata uploaded to IPFS:", tokenURI);

        // Convert IPFS URI to HTTP gateway URL for frontend display
        const httpImageUrl = imageURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

        // 7. Return result
        res.json({
            success: true,
            traits: finalTraits,
            imageUrl: httpImageUrl,
            imageURI,
            tokenURI,
            metadata
        });

    } catch (error) {
        console.error("Generation failed:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
});

app.post('/api/mint', async (req, res) => {
    try {
        const { tokenId, ownerAddress, metadata, traits } = req.body;

        // Validate required fields
        if (!tokenId || !ownerAddress || !metadata) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const newPokemon = await PokemonModel.create({
            tokenId,
            name: metadata.name,
            type: traits.type,
            element: traits.element,
            tier: traits.tier,
            style: traits.style,
            stats: traits.stats,
            imageUrl: metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'), // Store gateway URL for easier display
            ipfsUri: metadata.image,
            ownerAddress
        });

        res.json({ success: true, pokemon: newPokemon });
    } catch (error) {
        console.error("Mint recording failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/gallery', async (req, res) => {
    try {
        // Check if database is ready
        if (!db) {
            throw new Error('Database not connected');
        }
        
        const pokemon = await PokemonModel.getAll();
        res.json({ success: true, pokemon });
    } catch (error) {
        console.error("Gallery fetch failed:", error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch gallery. ' + (error.message || 'Please try again later.') 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
