const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server/database.sqlite');
const db = new sqlite3.Database(dbPath);

const runQuery = (query) => {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

async function check() {
    try {
        console.log('--- Events ---');
        const events = await runQuery("SELECT id, title, tags FROM events");
        console.log(events);
        
        console.log('\n--- Photos ---');
        const photos = await runQuery("SELECT id, title, tags FROM photos LIMIT 5");
        console.log(photos);

    } catch (error) {
        console.error(error);
    } finally {
        db.close();
    }
}

check();
