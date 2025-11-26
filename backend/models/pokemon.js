import db from '../db/index.js';

export const PokemonModel = {
    create: (data) => {
        return new Promise((resolve, reject) => {
            const {
                tokenId, name, type, element, tier, style,
                stats, imageUrl, ipfsUri, ownerAddress
            } = data;

            const sql = `INSERT INTO pokemon (
        token_id, name, type, element, tier, style, 
        hp, attack, defense, speed, 
        image_url, ipfs_uri, owner_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const params = [
                tokenId, name, type, element, tier, style,
                stats.hp, stats.attack, stats.defense, stats.speed,
                imageUrl, ipfsUri, ownerAddress
            ];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...data });
                }
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM pokemon ORDER BY created_at DESC`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    getByOwner: (ownerAddress) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM pokemon WHERE owner_address = ? ORDER BY created_at DESC`;
            db.all(sql, [ownerAddress], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};
