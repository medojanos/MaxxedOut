import db from "../config/db.js"
import { Error, dbError, Success, ReturnData, Validate, NotFound } from "../config/res.js";

export const getWorkoutByQuery = (req, res) => {
    const { month, date, name, limit } = req.query;

    if (Object.keys(req.query).length > 1) return Error(res, "Invalid query parameters");

    if (date) {
        db.all(
            `SELECT
                w.id AS workout_id,
                w.name AS workout_name,
                strftime('%s', w.ended_at) - strftime('%s', w.started_at) AS duration,
                e.id AS exercise_id,
                COALESCE(s.exercise_name, e.name) AS exercise_name,
                s.rep,
                s.weight
            FROM workouts w
            LEFT JOIN sets s ON s.workout_id = w.id
            LEFT JOIN exercises e ON s.exercise_id = e.id
            WHERE DATE(w.ended_at) = ?
            AND w.user_id = ?`,
            [date, req.user],
            (e, rows) => {
                if (e) return dbError(res);
                if (rows.length === 0) return NotFound(res, "No workout that day");

                const workoutsMap = {};

                rows.forEach(r => {
                    if (!workoutsMap[r.workout_id]) {
                        workoutsMap[r.workout_id] = {
                            id: r.workout_id,
                            name: r.workout_name,
                            duration: r.duration,
                            exercises: {}
                        };
                    }

                    const workout = workoutsMap[r.workout_id];

                    if (r.exercise_name) {
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
                    }
                });

                const result = Object.values(workoutsMap).map(w => ({
                    id: w.id,
                    name: w.name,
                    duration: w.duration,
                    exercises: Object.values(w.exercises)
                }));

                ReturnData(res, result);
            }
        );
    } else if (name) {
        db.get("SELECT id, name FROM workouts WHERE user_id = ? AND name = ? ORDER BY ended_at DESC LIMIT 1", [req.user, name], (e, workout) => {
            if (e) return dbError(res);
            if (!workout) return NotFound(res, "No recent workout");
            db.all(`SELECT
                    e.id AS exercise_id,
                    COALESCE(s.exercise_name, e.name) AS exercise_name,
                    rep,
                    weight
                    FROM sets s
                    LEFT JOIN exercises e ON s.exercise_id = e.id
                    JOIN workouts w ON w.id = s.workout_id
                    WHERE s.workout_id = ?`, workout.id, (e, rows) => {
                    if (e) return dbError(res);

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

                    ReturnData(res, Object.values(exercisesMap));
                }
            );
        });
    } else if (month) {
        db.all("SELECT DATE(ended_at) AS ended_at FROM workouts WHERE user_id = ? AND STRFTIME('%Y-%m', ended_at) = ?", [req.user, month], (e, rows) => {
                if (e) return dbError(res);
                ReturnData(res, rows);
            }
        );
    } else if (limit) {
        let query = "SELECT id, name, ended_at FROM workouts WHERE user_id = ? ORDER BY ended_at DESC";
        let params = [];
        params.push(req.user);
        if (limit) {
            query += " LIMIT ?";
            params.push(limit)
        };
        db.all(query, params, (e, rows) => {
            if (e) return dbError(res); 
            ReturnData(res, rows);
        })
    }
}

export const getWorkoutById = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id");

    db.get(
        "SELECT id, name, strftime('%s', ended_at) - strftime('%s', started_at) AS length FROM workouts WHERE id = ?", [id], (e, workout) => {
            if (e) return dbError(res);
            db.all(
                `SELECT 
                e.id as exercise_id,
                COALESCE(s.exercise_name, e.name) as exercise_name,
                rep,
                weight
                FROM sets s
                LEFT JOIN exercises e ON s.exercise_id = e.id
                WHERE s.workout_id = ?`, [workout.id],(e, rows) => {
                    if (e) return dbError(res);
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

                    ReturnData(res, [{
                        id: workout.id, 
                        name: workout.name, 
                        duration: workout.length,
                        exercises: Object.values(exercisesMap)
                    }])
                }
            );
        }
    );
}

export const addWorkout = (req, res) => {
    const { name, started_at, ended_at, plan } = req.body;

    if (!Validate(name)) return Error(res, "Invalid workout name");

    db.run("INSERT INTO workouts (user_id, name, started_at, ended_at) VALUES (?, ?, ?, ?)", [req.user, name, started_at, ended_at], function(e) {
        if (e) return dbError(res); 
        
        let completed = 0;
        let totalSets = 0;
        const id = this.lastID;

        plan?.forEach(exercise => {
            totalSets += exercise.sets.length;
        });

        if (totalSets == 0) return Success(res, "Workout saved");

        function Check(err) {
            if (err) return dbError(res); 
            completed++;
            if (completed == totalSets) return Success(res, "Workout saved");
        }
    
        plan.forEach(exercise => {
            if(!exercise.id || typeof exercise.id == "string") {
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
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id");

    db.run("DELETE FROM workouts WHERE id = ?", [id], (e) => {
        if (e) return dbError(res);
        Success(res, "Workout deleted");
    })
}