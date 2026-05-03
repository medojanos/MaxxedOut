import sqlite3 from 'sqlite3'
import fs from 'fs'
import bcrypt from 'bcrypt';

const dbFile = "maxxedout.db";
const exists = fs.existsSync(dbFile);

if (!exists) {
    const db = new sqlite3.Database(dbFile);

    const schema = fs.readFileSync("./schema.sql", "utf-8");
    const seed = fs.readFileSync("./seed.sql", "utf-8");
    
    db.serialize(() => {
        db.exec(schema);
        db.exec(seed);
        db.run("INSERT INTO users (email, password, nickname) VALUES ('johndoe@yahoo.com', ?, 'John')", [bcrypt.hashSync("1234", 10)], (e) => {
            if (e) return console.error("Error seeding database:", e);
        });
    });

    db.close();
    
    console.log("Database initialized succesfully");
} else {
    console.log("Database already exists");
}
