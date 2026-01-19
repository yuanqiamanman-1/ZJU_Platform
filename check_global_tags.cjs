const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server/database.sqlite');
const db = new sqlite3.Database(dbPath);

async function check() {
    db.all("SELECT * FROM tags WHERE name = '赛博朋克'", (err, rows) => {
        if (err) console.error(err);
        else console.log('Global Tags Table:', rows);
    });
}

check();
