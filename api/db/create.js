import sqlite3 from 'sqlite3'
import { hash } from 'crypto'

const db = new sqlite3.Database("maxxedout.db");

db.serialize(() => {
    // Clear DB
    db.run("DROP TABLE IF EXISTS users;");
    db.run("DROP TABLE IF EXISTS codes;");
    db.run("DROP TABLE IF EXISTS exercises;");
    db.run("DROP TABLE IF EXISTS workouts;");
    db.run("DROP TABLE IF EXISTS sets;");

    // Tables
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, nickname TEXT(20), password TEXT(128));");
    db.run("CREATE TABLE codes (code INTEGER PRIMARY KEY, user_id INTEGER, expiry DATETIME, used BOOLEAN DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id));");
    db.run("CREATE TABLE workouts (id INTEGER PRIMARY KEY, user_id INTEGER, date DATETIME DEFAULT CURRENT_DATE, FOREIGN KEY (user_id) REFERENCES users(id));");
    db.run("CREATE TABLE sets (id INTEGER PRIMARY KEY, workout_id INTEGER, exercise_id INTEGER, rep INTEGER DEFAULT 0, weight INTEGER DEFAULT 0, FOREIGN KEY (workout_id) REFERENCES workouts(id), FOREIGN KEY (exercise_id) REFERENCES exercises(id));")
    db.run("CREATE TABLE exercises (id INTEGER PRIMARY KEY, name TEXT(255));");

    // Test data
    db.run("INSERT INTO users (email, nickname, password) VALUES ('johndoe@yahoo.com', 'John Doe', '" + hash("sha-512", "1234") + "');");
    db.run("INSERT INTO exercises (name) VALUES ('Squat');");
    db.run("INSERT INTO exercises (name) VALUES ('Bench');");
    db.run("INSERT INTO exercises (name) VALUES ('Deadlift');");

    console.log("Database initialized succesfully")
});

db.close();