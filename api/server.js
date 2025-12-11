import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { hash } from 'crypto'
import { randomBytes } from 'crypto'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbPath = path.join(dirname, 'db', 'maxxedout.db')
const readmePath = path.join(dirname, '..', 'README.md')

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database(dbPath, (e) => {
    if (e) console.error("Database error: ", e)
    else console.log("Database opened successfully")
})

// Open api
app.get("/", (req, res) => {
    res.send("The API is working!")
})

app.get("/readme", (req, res) => {
    fs.readFile(readmePath, "utf-8", (e, text) => {
        res.send(text)
    })
})

app.get("/exercises", (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group FROM muscle_groups_exercises mge JOIN exercises e ON e.id=mge.exercise_id JOIN muscle_groups mg ON mg.id=mge.muscle_group_id ", (e, rows) => {
        const map = {};
        rows.forEach(row => {
            if (!map[row.id]) {
                map[row.id] = {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                    muscle_groups: []
                };
            }
            map[row.id].muscle_groups.push(row.muscle_group);
        });
        res.json(map);
    })
})

app.get("/muscle_groups", (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        res.json(rows);
    })
})

app.post("/register", (req, res) => {
    db.get("SELECT * FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (row) return res.status(400).json({success: false, message: "Email already registered"});
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [req.body.email, hash('sha-512', req.body.password)], (e) => {
            if (e) return res.status(500).json({ success: false, message: "Database error"});
            res.json({success: true, message : "Successfully registered"});
        })
    })
    
})

app.post("/login", (req, res) => {
    db.get("SELECT id, email, nickname FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
        let token = randomBytes(32).toString('hex');
        db.run("INSERT INTO tokens (token, user_id) VALUES (?, ?)", [token, row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Successfully logged in", data : {token : token, userData: {email : row.email, nickname : row.nickname}}});
        });
    })
})

// Closed api
async function Auth(token) {
    return new Promise((res, rej) => {
        db.get("SELECT user_id FROM tokens WHERE token = ?", [token], (e, row) => {
            if (e) rej(e)
            row ? res(row) : res(null)
        })
    })
}

async function AuthMiddleWare(req, res, next) {
    const auth = await Auth(req.headers["authorization"]);
    if (!auth) return res.status(401).json({success: false, message: "Invalid token"});
    req.user = auth.user_id;
    next(); 
}

// Below this line the apis will be authenticated
app.use(AuthMiddleWare);

app.get("/plans", (req, res) => {
    db.all("SELECT id, user_id, name FROM plans WHERE user_id = ?", [req.user], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: rows});
    })
})
app.get("/plans/:id", (req, res) => {
    db.all("SELECT e.id as id, COALESCE(pe.exercise_name, e.name) as name, pe.sets as sets FROM plans_exercises pe LEFT JOIN exercises e ON pe.exercise_id = e.id WHERE pe.plan_id = ?", [req.params.id], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: rows});
    })
})
app.put("/plans", (req, res) => {
    db.run("INSERT INTO plans (user_id, name) VALUES (?, ?)", [req.user, req.body.name], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 

        let completed = 0;
        const id = this.lastID;

        function Check(err) {
            if (err) return res.status(500).json({success: false, message: "Database error"}); 
            completed++;
            if (completed == req.body.exercises.length) res.json({success: true, message: "Workout created succesfully"})
        }

        req.body.exercises.forEach(exercise => {
            if (typeof exercise.id == "string") {
                db.run("INSERT INTO plans_exercises (plan_id, exercise_name, sets) VALUES (?, ?, ?)", [id, exercise.name, exercise.sets], (e) => Check(e))
            } else {
                db.run("INSERT INTO plans_exercises (plan_id, exercise_id, sets) VALUES (?, ?, ?)", [id, exercise.id, exercise.sets], (e) => Check(e))
            }
        });
    })
})

app.get("/sets", (req, res) => {
    db.all("SELECT * FROM sets", (e, rows) => {
        res.json(rows);
    })
})

app.put("/workout", (req, res) => {
    db.run("INSERT INTO workouts (user_id) VALUES (?)", [req.user], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 

        let completed = 0;
        const id = this.lastID;

        function Check(err) {
            if (err) return res.status(500).json({success: false, message: "Database error"}); 
            completed++;
            if (completed == req.body.plan.length) res.json({success: true, message: "Workout stored succesfully"})
        }
    
        req.body.plan.forEach(exercise => {
            if(exercise.id == null || typeof exercise.id == "string"){
                exercise.sets.forEach(set => {
                    db.run("INSERT INTO sets (workout_id, exercise_name, rep, weight) VALUES (?, ?, ?, ?)", [id, exercise.name, set.rep, set.kg], (e) => Check(e));
                })          
            } else {
                exercise.sets.forEach(set => {
                    db.run("INSERT INTO sets (workout_id, exercise_id, rep, weight) VALUES (?, ?, ?, ?)", [id, exercise.id, set.rep, set.kg], (e) => Check(e));
                })  
            }
        })
    })
})

app.patch("/user", (req, res) => {
    function update(column, columnData) {
        db.run("UPDATE users SET " + column + " = ? WHERE id = ?", [columnData, req.user], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            db.get("SELECT email, nickname FROM users WHERE id = ?", [req.user], (e, row) => {
                if (e) return res.status(500).json({success: false, message: "Database error"});
                res.json({success : true, message : "Profile updated succesfully", data : row});
            })
        })
    }
    if (req.body.nickname) return update("nickname", req.body.nickname);
    if (req.body.email) return update("email", req.body.email);
    if (req.body.password) {
        return db.get("SELECT id FROM users WHERE password = ?", [hash("sha-512", req.body.currentPassword)], (e, row) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
            update("password", hash("sha-512", req.body.password))
        })
    }
    return res.status(400).json({success: false, message: "No changes made"});
})

app.get("/auth", (req, res) => {
    if (!req.user) return res.status(401).json({success: false, message: "Invalid token"})
    res.json({success: true})
})

const PORT = 4000
app.listen(PORT, () => {
    console.log("API listening on http://localhost:" + PORT)
})
