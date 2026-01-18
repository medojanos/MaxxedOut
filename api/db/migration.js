import sqlite3 from 'sqlite3'
import fs from 'fs'

const dbFile = "maxxedout.db";
const exists = fs.existsSync(dbFile);

if (!exists) {
    const db = new sqlite3.Database(dbFile);

    const schema = fs.readFileSync("./schema.sql", "utf-8");
    const seed = fs.readFileSync("./seed.sql", "utf-8");

    db.serialize(() => {
        db.exec(schema);
        db.exec(seed);
    });

    db.close();
    
    console.log("Database initialized succesfully");
} else {
    console.log("Database already exists");
}
