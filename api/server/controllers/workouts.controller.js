import db from "../config/db.js"

export const getWorkoutByQuery = (req, res) => {
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
}

export const getWorkoutById = (req, res) => {
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
}

export const addWorkout = (req, res) => {
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
}

export const deleteWorkout = (req, res) => {
    db.run("DELETE FROM workouts WHERE id = ?", [req.params.id], (e) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json({success: true, message: "Workout deleted succesfully"});
    })
}