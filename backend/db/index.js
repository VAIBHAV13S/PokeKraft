import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../../data');
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'pokee.db');
console.log('Database path:', dbPath);

// Initialize database with verbose mode for better error messages
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1); // Exit if we can't connect to the database
    } else {
        console.log('Connected to the SQLite database at', dbPath);
        createTables();
    }
});

// Enable foreign keys and better concurrency
db.serialize(() => {
    db.run('PRAGMA journal_mode=WAL;');
    db.run('PRAGMA foreign_keys=ON;');
});

function createTables() {
    // Create pokemon table with proper schema
    db.run(`CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_id TEXT NOT NULL UNIQUE,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating pokemon table:', err);
            return;
        }
        
        // Create indexes
        db.run('CREATE INDEX IF NOT EXISTS idx_pokemon_owner ON pokemon(owner_address)');
        db.run('CREATE INDEX IF NOT EXISTS idx_pokemon_token_id ON pokemon(token_id)');
        
        console.log('Database tables and indexes created/verified');
    });
}

export default db;
