import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { hash, randomBytes } from 'crypto'
import nodemailer from "nodemailer";
import 'dotenv/config';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbPath = path.join(dirname, 'db', 'maxxedout.db')
const readmePath = path.join(dirname, '..', 'README.md')

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

await transporter.verify();

const db = new sqlite3.Database(dbPath, (e) => {
    if (e) return console.error("Database error: ", e)
    db.run("PRAGMA foreign_keys = ON;")
    console.log("Database opened successfully")
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

app.get("/muscle_groups", (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json(rows);
    })  
})

app.get("/exercises", (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group FROM muscle_groups_exercises mge JOIN exercises e ON e.id=mge.exercise_id JOIN muscle_groups mg ON mg.id=mge.muscle_group_id ", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        const exercisesMap = {};

        rows.forEach(row => {
            if (!exercisesMap[row.id]) {
                exercisesMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                    muscle_groups: []
                };
            }
            exercisesMap[row.id].muscle_groups.push(row.muscle_group);
        });

        res.json(exercisesMap);
    })
})


app.get("/plan-info/:id", (req, res) => {
    db.all("SELECT e.id as exercise_id, COALESCE(pe.exercise_name, e.name) as name, e.type as type, pe.sets as sets FROM plans_exercises pe LEFT JOIN exercises e ON pe.exercise_id = e.id WHERE pe.plan_id = ?", [req.params.id], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 

        const exerciseTypes = {};
        let exIds = []
        let exCustom = 0;

        rows.forEach(row => {
            let type;

            if(!row.exercise_id) {
                type="Custom";
                exCustom+=row.sets;
            }
            else {
                type = row.type;
                exIds.push(row.exercise_id);
            }

            if(!exerciseTypes[type]){
                exerciseTypes[type] = {
                    type: type,
                    exercises: 0,
                    sets: 0
                }
            }

            exerciseTypes[type].exercises++;
            exerciseTypes[type].sets += row.sets;
        });

        const musclegroupsMap = {}

        db.all(`SELECT mge.role AS role, mg.name AS muscle_group, pe.sets AS sets FROM plans_exercises pe JOIN muscle_groups_exercises mge ON mge.exercise_id = pe.exercise_id JOIN muscle_groups mg ON mg.id=mge.muscle_group_id WHERE pe.exercise_id IN (${exIds.map(() => "?").join(",")})`, exIds, (e, rows) => {
            if (e) return res.status(500).json({success: false, message: "Database error"}); 

            rows.forEach(row => {
                if(!musclegroupsMap[row.muscle_group]){
                    musclegroupsMap[row.muscle_group] = {
                        muscle_group: row.muscle_group,
                        sets: 0
                    }
                }

                if(row.role == "Primary") musclegroupsMap[row.muscle_group].sets += row.sets;
                if(row.role == "Secondary") musclegroupsMap[row.muscle_group].sets += row.sets * 0.5;
            })

            res.json({success: true, data: {types: Object.values(exerciseTypes), muscle_groups: Object.values(musclegroupsMap), custom: exCustom}});
        })
    })
})

app.get("/exercises/:id", (req, res) => {
    db.all("SELECT e.id as id, e.type as type, mg.name as muscle_group, mge.role as role FROM muscle_groups_exercises mge JOIN exercises e ON e.id=mge.exercise_id JOIN muscle_groups mg ON mg.id=mge.muscle_group_id WHERE e.id=?", [req.params.id] , (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        const musclegroupsMap = {};

        if(rows.length === 0) {
            return res.json({
                    success: true,
                    data: { type: "Custom" }
            });
        }

        rows.forEach(row => {
            if (!musclegroupsMap[row.role]) {
                musclegroupsMap[row.role] = []
            };

            musclegroupsMap[row.role].push(row.muscle_group);
        });

        res.json({success: true, data: {type: rows[0].type, muscle_groups: musclegroupsMap}});
    })
})

app.post("/register", (req, res) => {
    db.get("SELECT * FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (row) return res.status(401).json({success: false, message: "Email already registered"});
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

app.post("/forgot-password", (req, res) => {
    db.get("SELECT id FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) return res.status(404).json({success: false, message: "Email not found"});
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        db.run("INSERT INTO codes (user_id, code) VALUES (?, ?)", [row.id, code], async (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            try {
                await transporter.sendMail({
                    from: `"MaxxedOut" <${process.env.EMAIL_USER}>`,
                    to: req.body.email,
                    subject: "Password Reset Code",
                    text: `Your reset code is: ${code}`,
                    html: `<h3>Your reset code is: ${code}</h3>`,
                });
                res.json({ success: true, message: "Email sent!" });
            } catch (error) {
                res.status(500).json({ success: false, message: "Failed to send email" });
            }
        })
    })
})
app.post("/verify-code", (req, res) => {
    db.get("SELECT c.code FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.created_at DESC LIMIT 1", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row || row.code !== req.body.code) return res.status(400).json({success: false, message: "Invalid code"});
        res.json({success: true, message: "Code verified"});
    })
})
app.post("/reset-password", (req, res) => {
    db.get("SELECT c.code, u.id FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.created_at DESC LIMIT 1", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row || row.code !== req.body.code) return res.status(400).json({success: false, message: "Invalid code"});
        db.run("UPDATE users SET password = ? WHERE id = ?", [hash("sha-512", req.body.password), row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Password reset succesfully"});
        })
    })
})
app.delete("/user", (req, res) => {
    db.get("SELECT id FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
        db.run("DELETE FROM users WHERE id = ?", [row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Account deleted succesfully"});
        })
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

app.put("/plan", (req, res) => {
    db.run("INSERT INTO plans (user_id, name) VALUES (?, ?)", [req.user, req.body.name], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (req.body.exercises.length === 0) return res.json({success: true, message: "Workout plan created succesfully"});
        
        let completed = 0;
        const id = this.lastID;

        function Check(err) {
            if (err) return res.status(500).json({success: false, message: "Database error"}); 
            completed++;
            if (completed == req.body.exercises.length) res.json({success: true, message: "Workout plan created succesfully"})
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
app.patch("/plans/:id", (req, res) => {
    db.run("UPDATE plans SET name = ? WHERE id = ?", [req.body.name, req.params.id], (e) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 

        db.run("DELETE FROM plans_exercises WHERE plan_id = ?", [req.params.id], function(e) {
            if (e) return res.status(500).json({success: false, message: "Database error"});

            let completed = 0;

            function Check(err) {
                if (err) return res.status(500).json({success: false, message: "Database error"}); 
                completed++;
                if (completed == req.body.exercises.length) res.json({success: true, message: "Workout plan updated succesfully"})
            }

            req.body.exercises.forEach(exercise => {
                if (!exercise.id || typeof exercise.id == "string") {
                    db.run("INSERT INTO plans_exercises (plan_id, exercise_name, sets) VALUES (?, ?, ?)", [req.params.id, exercise.name, exercise.sets], (e) => Check(e))
                } else {
                    db.run("INSERT INTO plans_exercises (plan_id, exercise_id, sets) VALUES (?, ?, ?)", [req.params.id, exercise.id, exercise.sets], (e) => Check(e))
                }
            });
        })
    })
})
app.get("/plans", (req, res) => {
    db.all("SELECT id, user_id, name FROM plans WHERE user_id = ?", [req.user], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: rows});
    })
})
app.get("/plans/:id", (req, res) => {
    db.all("SELECT e.id as id, COALESCE(pe.exercise_name, e.name) as name, pe.sets as sets FROM plans_exercises pe LEFT JOIN exercises e ON pe.exercise_id = e.id WHERE pe.plan_id = ?", [req.params.id], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: {plan: rows}});
    })
})
app.delete("/plans/:id", (req, res) => {
    db.run("DELETE FROM plans WHERE id = ?", [req.params.id], (e) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json({success: true, message: "Plan deleted succesfully"});
    })
})
app.put("/workouts", (req, res) => {
    db.run("INSERT INTO workouts (user_id, name, started_at, ended_at) VALUES (?, ?, ?, ?)", [req.user, req.body.name, req.body.started_at, req.body.ended_at], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        
        let completed = 0;
        let totalSets = 0;
        const id = this.lastID;

        req.body.plan.forEach(exercise => {
            totalSets += exercise.sets.length;
        });

        if (totalSets == 0) return res.json({success: true, message: "Workout stored succesfully"})

        function Check(err) {
            if (err) return res.status(500).json({success: false, message: "Database error"}); 
            completed++;
            if (completed == totalSets) res.json({success: true, message: "Workout stored succesfully"})
        }
    
        req.body.plan.forEach(exercise => {
            if(!exercise.id || typeof exercise.id == "string"){
                exercise.sets.forEach(set => {
                    db.run("INSERT INTO sets (workout_id, exercise_name, rep, weight) VALUES (?, ?, ?, ?)", [id, exercise.name, set.rep, set.weight], (e) => Check(e));
                })          
            } else {
                exercise.sets.forEach(set => {
                    db.run("INSERT INTO sets (workout_id, exercise_id, rep, weight) VALUES (?, ?, ?, ?)", [id, exercise.id, set.rep, set.weight], (e) => Check(e));
                })  
            }
        })
    })
})
app.get("/workouts", (req, res) => {
    const { month, date, name, limit } = req.query;
    if (Object.keys(req.query).length > 1) return res.status(400).json({success: false, message: "Invalid query parameters"});
    if (date) {
        db.all("SELECT id, name FROM workouts WHERE DATE(ended_at) = ? AND user_id = ?", [req.query.date, req.user], (e, workouts) => {
            if (e) return res.status(500).json({ success: false, message: "Database error" });
            if (workouts.length === 0) return res.json({ success: false, message: "No workout that day" });
            const workoutIds = workouts.map(w => w.id);
            db.all(`SELECT
                    w.id AS workout_id,
                    w.name AS workout_name,
                    e.id AS exercise_id,
                    COALESCE(s.exercise_name, e.name) AS exercise_name,
                    rep,
                    weight
                    FROM sets s
                    LEFT JOIN exercises e ON s.exercise_id = e.id
                    JOIN workouts w ON w.id = s.workout_id
                    WHERE s.workout_id IN (${workoutIds.map(() => "?").join(",")})`, workoutIds, (e, rows) => {
                    if (e) return res.status(500).json({ success: false, message: "Database error" });
                    const workoutsMap = {};
                    rows.forEach(r => {
                        if (!workoutsMap[r.workout_id]) {
                            workoutsMap[r.workout_id] = {
                                id: r.workout_id,
                                name: r.workout_name,
                                exercises: {}
                            };
                        }
                        const workout = workoutsMap[r.workout_id];
                        if (!workout.exercises[r.exercise_name]) {
                            workout.exercises[r.exercise_name] = {
                                id: r.exercise_id,
                                name: r.exercise_name,
                                sets: []
                            };
                        }
                        workout.exercises[r.exercise_name].sets.push({
                            weight: r.weight,
                            rep: r.rep
                        });
                    });
                    const result = Object.values(workoutsMap).map(w => ({
                        id: w.id,
                        name: w.name,
                        exercises: Object.values(w.exercises)
                    }));
                    res.json({ success: true, data: result});
                }
            );
        });
    } else if (name) {
        db.get("SELECT id, name FROM workouts WHERE user_id = ? AND name = ? ORDER BY ended_at DESC LIMIT 1", [req.user, req.query.name], (e, workout) => {
            if (e) return res.status(500).json({ success: false, message: "Database error" });
            if (!workout) return res.json({ success: false, message: "No recent workout" });
            db.all(`SELECT
                    e.id AS exercise_id,
                    COALESCE(s.exercise_name, e.name) AS exercise_name,
                    rep,
                    weight
                    FROM sets s
                    LEFT JOIN exercises e ON s.exercise_id = e.id
                    JOIN workouts w ON w.id = s.workout_id
                    WHERE s.workout_id = ?`, workout.id, (e, rows) => {
                    if (e) return res.status(500).json({ success: false, message: "Database error" });

                    const exercisesMap = {};
                    rows.forEach(r => {
                        if (!exercisesMap[r.exercise_name]) {
                            exercisesMap[r.exercise_name] = {
                                id: r.exercise_id,
                                name: r.exercise_name,
                                sets: []
                            };
                        }
                        exercisesMap[r.exercise_name].sets.push({
                            weight: r.weight,
                            rep: r.rep
                        });
                    });

                    res.json({
                        success: true,
                        data: Object.values(exercisesMap)
                    });
                }
            );
        });
    } else if (month) {
        db.all("SELECT DATE(ended_at) AS ended_at FROM workouts WHERE user_id = ? AND STRFTIME('%Y-%m', ended_at) = ?", [req.user, req.query.month], (e, rows) => {
                if (e) return res.status(500).json({ success: false, message: "Database error" });
                res.json({success: true, data: rows});
            }
        );
    } else {
        let query = "SELECT id, name, ended_at FROM workouts WHERE user_id = ? ORDER BY ended_at DESC";
        let params = [];
        params.push(req.user);
        if (limit) {
            query += " LIMIT ?";
            params.push(limit)
        };
        db.all(query, params, (e, rows) => {
            if (e) return res.status(500).json({success: false, message: "Database error"}); 
            res.json({success: true, data: rows});
        })
    }
});
app.delete("/workouts/:id", (req, res) => {
    db.run("DELETE FROM workouts WHERE id = ?", [req.params.id], (e) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json({success: true, message: "Workout deleted succesfully"});
    })
})
app.get("/workouts/:id", (req, res) => {
    db.get(
        "SELECT id, name FROM workouts WHERE id = ?", [req.params.id], (e, workout) => {
            if (e) return res.status(500).json({ success: false, message: "Database error" });
            db.all(
                `SELECT 
                e.id as exercise_id,
                COALESCE(s.exercise_name, e.name) as exercise_name,
                rep,
                weight
                FROM sets s
                LEFT JOIN exercises e ON s.exercise_id = e.id
                WHERE s.workout_id = ?`, [workout.id],(e, rows) => {
                    if (e) return res.status(500).json({ success: false, message: "Database error" });
                    const exercisesMap = {};
                    rows.forEach(r => {
                        if (!exercisesMap[r.exercise_name]) {
                            exercisesMap[r.exercise_name] = {
                                id: r.exercise_id,
                                name: r.exercise_name,
                                sets: []
                            };
                        }
                        exercisesMap[r.exercise_name].sets.push({
                            weight: r.weight,
                            rep: r.rep
                        });
                    });

                    res.json({success: true, data: 
                        [{
                            id: workout.id, 
                            name: workout.name, 
                            exercises: Object.values(exercisesMap)
                        }]
                    });
                }
            );
        }
    );
});

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
        return db.get("SELECT id FROM users WHERE password = ? AND id = ?", [hash("sha-512", req.body.currentPassword), req.user], (e, row) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
            update("password", hash("sha-512", req.body.password))
        })
    }
    res.status(400).json({success: false, message: "No changes made"});
})

app.get("/statistics", (req, res) => {
    db.get(`
        SELECT 
        COUNT(*) AS total_workouts,
        AVG((strftime('%s', ended_at) - strftime('%s', started_at)) / 60.0) AS avg_duration
        FROM workouts
        WHERE user_id = ?`, [req.user], (e, workouts) => {
        if (e) return res.status(500).json({ success: false, message: "Database error" });
        db.get(`SELECT 
            SUM(s.weight * s.rep) AS total_weight,

            (SELECT weight FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 3 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS max_squat,

            (SELECT rep FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 3 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS reps_squat,

            (SELECT weight FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 1 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS max_bench,

            (SELECT rep FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 1 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS reps_bench,

            (SELECT weight FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 2 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS max_deadlift,

            (SELECT rep FROM sets
            JOIN workouts ON sets.workout_id = workouts.id
            WHERE exercise_id = 2 AND workouts.user_id = ?
            ORDER BY weight DESC LIMIT 1) AS reps_deadlift

            FROM sets s
            JOIN workouts w ON s.workout_id = w.id
            WHERE w.user_id = ?`, Array.from({length: 7}, () => req.user), (e, sets) => {
            if (e) return res.status(500).json({ success: false, message: "Database error" });
            res.json({
                success: true,
                data: {
                    totalWorkouts: workouts.total_workouts || 0,
                    avgDuration: Math.round(workouts.avg_duration) || 0,
                    totalWeight: sets.total_weight || 0,
                    maxSquat: sets.max_squat || 0,
                    repsSquat: sets.reps_squat || 0,
                    maxBench: sets.max_bench || 0,
                    repsBench: sets.reps_bench || 0,
                    maxDeadlift: sets.max_deadlift || 0,
                    repsDeadlift: sets.reps_deadlift || 0
                }
            });
        });
    });
});
        

app.get("/auth", (req, res) => {
    if (!req.user) return res.status(401).json({success: false, message: "Invalid token"})
    res.json({success: true})
})

app.listen(4000, () => {
    console.log("API listening on http://localhost:4000")
})
