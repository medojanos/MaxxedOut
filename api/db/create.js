import sqlite3 from 'sqlite3'
import fs from 'fs'

const dbFile = "maxxedout.db";

if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log("Existing database removed");
}

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
    const schema = fs.readFileSync("./schema.sql", "utf-8");
    const seed = fs.readFileSync("./seed.sql", "utf-8");

    db.exec(schema);
    db.exec(seed);

    console.log("Database initialized succesfully");
});

db.close();