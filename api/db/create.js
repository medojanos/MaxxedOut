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
    db.run("DROP TABLE IF EXISTS muscle_groups;");
    db.run("DROP TABLE IF EXISTS muscle_groups_exercises;");
    db.run("DROP TABLE IF EXISTS tokens;");
    db.run("DROP TABLE IF EXISTS plans;");

    // Tables
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, nickname TEXT(20), password TEXT(128));");
    db.run("CREATE TABLE codes (code INTEGER PRIMARY KEY, user_id INTEGER, expiry DATETIME, used BOOLEAN DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id));");
    db.run("CREATE TABLE workouts (id INTEGER PRIMARY KEY, user_id INTEGER, date DATETIME DEFAULT CURRENT_DATE, FOREIGN KEY (user_id) REFERENCES users(id));");
    db.run("CREATE TABLE sets (id INTEGER PRIMARY KEY, workout_id INTEGER, exercise_id INTEGER, rep INTEGER DEFAULT 0, weight INTEGER DEFAULT 0, FOREIGN KEY (workout_id) REFERENCES workouts(id), FOREIGN KEY (exercise_id) REFERENCES exercises(id));")
    db.run("CREATE TABLE exercises (id INTEGER PRIMARY KEY, name TEXT(255), type TEXT(255));");
    db.run("CREATE TABLE muscle_groups (id INTEGER PRIMARY KEY, name TEXT(255));");
    db.run("CREATE TABLE muscle_groups_exercises (muscle_groups_id INTEGER, exercises_id INTEGER, role TEXT(255), FOREIGN KEY (muscle_groups_id) REFERENCES muscle_groups(id), FOREIGN KEY (exercises_id) REFERENCES exercises(id));");
    db.run("CREATE TABLE tokens (token TEXT(64), user_id INTEGER);");
    db.run("CREATE TABLE plans (id INTEGER, name TEXT(255), user_id INTEGER);");

    // Test data
    db.run("INSERT INTO users (email, nickname, password) VALUES ('johndoe@yahoo.com', 'John Doe', '" + hash("sha-512", "1234") + "');");
    db.run("INSERT INTO exercises (name, type) VALUES ('Squat', 'Compound');");
    db.run("INSERT INTO exercises (name, type) VALUES ('Bench', 'Compound');");
    db.run("INSERT INTO exercises (name, type) VALUES ('Deadlift', 'Compound');");
    db.run("INSERT INTO muscle_groups (name) VALUES ('Chest');");
    db.run("INSERT INTO muscle_groups (name) VALUES ('Triceps');");
    db.run("INSERT INTO muscle_groups (name) VALUES ('Delts');");
    db.run("INSERT INTO muscle_groups (name) VALUES ('Lats');");
    db.run("INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES (1, 2, 'Primary');");
    db.run("INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES (2, 2, 'Secondary');");
    db.run("INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES (3, 2, 'Secondary');");
    db.run("INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES (4, 2, 'Stabilizer');");
    db.run("INSERT INTO muscle_groups_exercises (muscle_groups_id, exercises_id, role) VALUES (4, 3, 'Secondary');");
    db.run("INSERT INTO plans (name, user_id) VALUES ('Chest day', 1);");

    console.log("Database initialized succesfully");
});

db.close();