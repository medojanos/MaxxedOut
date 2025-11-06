import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("maxxedout.db");

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users;");
    db.run("DROP TABLE IF EXISTS exercises;");

    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL, nickname TEXT (20), password TEXT (128) NOT NULL);");
    db.run("CREATE TABLE exercises (id INTEGER PRIMARY KEY, name TEXT NOT NULL);");

    db.run("INSERT INTO users (email, nickname, password) VALUES ('johndoe@yahoo.com', 'John Doe', '1234');");
    db.run("INSERT INTO exercises (name) VALUES ('Squat');");
    db.run("INSERT INTO exercises (name) VALUES ('Bench');");
    db.run("INSERT INTO exercises (name) VALUES ('Deadlift');");

    console.log("Database initialized succesfully")
});

db.close();