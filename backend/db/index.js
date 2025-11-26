import sqlite3 from 'sqlite3';
// import { open } from 'sqlite3';

// Initialize database
const db = new sqlite3.Database('./pokee.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_id INTEGER,
    name TEXT NOT NULL,
    type TEXT,
    element TEXT,
    tier TEXT,
    style TEXT,
    hp INTEGER,
    attack INTEGER,
    defense INTEGER,
    speed INTEGER,
    image_url TEXT,
    ipfs_uri TEXT,
    owner_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Pokemon table ready.');
        }
    });
}

export default db;
