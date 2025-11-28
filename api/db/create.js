import sqlite3 from 'sqlite3'
import fs from 'fs'

const db = new sqlite3.Database("maxxedout.db");

db.serialize(() => {
    const schema = fs.readFileSync("./schema.sql", "utf-8");
    const seed = fs.readFileSync("./seed.sql", "utf-8");

    db.exec(schema);
    db.exec(seed);

    console.log("Database initialized succesfully");
});

db.close();