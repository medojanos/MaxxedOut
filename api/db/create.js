import sqlite3 from 'sqlite3'
import fs from 'fs'

const dbFile = "maxxedout.db";
const db = new sqlite3.Database(dbFile);

if (fs.existsSync(dbFile)) {
    console.log("Database already exists");
} else {
    const schema = fs.readFileSync("./schema.sql", "utf-8");
    const seed = fs.readFileSync("./seed.sql", "utf-8");

    db.serialize(() => {
        db.exec(schema);
        db.exec(seed);
    });

    console.log("Database initialized succesfully");
}

db.close();