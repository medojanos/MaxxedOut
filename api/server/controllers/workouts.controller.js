import db from "../config/db.js"
import { Error, dbError, ReturnData, Validate, ValidateNumber, NotFound, NoContent } from "../config/utility.js";

export const getWorkoutByQuery = async (req, res) => {
    const { month, date, name, limit } = req.query;

    if (Object.keys(req.query).length > 1) return Error(res, "Invalid query parameters");

    try {
        if (date) {
            const [rows] = await db.query(
                `SELECT
                    w.id AS workout_id,
                    w.name AS workout_name,
                    TIMESTAMPDIFF(SECOND, w.started_at, w.ended_at) AS duration,
                    DATE_FORMAT(w.ended_at, '%H:%i') AS ended_at,
                    e.id AS exercise_id,
                    COALESCE(s.exercise_name, e.name) AS exercise_name,
                    s.rep,
                    s.weight
                FROM workouts w
                LEFT JOIN sets s ON s.workout_id = w.id
                LEFT JOIN exercises e ON s.exercise_id = e.id
                WHERE DATE(w.ended_at) = ?
                AND w.user_id = ?
                ORDER BY s.position`,
                [date, req.user]
            );

            if (rows.length === 0) return NotFound(res, "No workout that day");

            const workoutsMap = {};

            rows.forEach(r => {
                if (!workoutsMap[r.workout_id]) {
                    workoutsMap[r.workout_id] = {
                        id: r.workout_id,
                        name: r.workout_name,
                        duration: Number(r.duration),
                        ended_at: r.ended_at,
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
                ended_at: w.ended_at,
                exercises: Object.values(w.exercises)
            }));

            return ReturnData(res, result);

        } else if (name) {
            const [workoutRows] = await db.query(
                "SELECT id, name FROM workouts WHERE user_id = ? AND name = ? ORDER BY ended_at DESC LIMIT 1",
                [req.user, name]
            );

            const workout = workoutRows[0];
            if (!workout) return NotFound(res, "No recent workout");

            const [rows] = await db.query(
                `SELECT
                    e.id AS exercise_id,
                    COALESCE(s.exercise_name, e.name) AS exercise_name,
                    rep,
                    weight
                FROM sets s
                LEFT JOIN exercises e ON s.exercise_id = e.id
                JOIN workouts w ON w.id = s.workout_id
                WHERE s.workout_id = ?`,
                [workout.id]
            );

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

            return ReturnData(res, Object.values(exercisesMap));

        } else if (month) {
            const [rows] = await db.query(
                `SELECT DATE_FORMAT(ended_at, '%Y-%m-%d') AS ended_at 
                 FROM workouts 
                 WHERE user_id = ? AND DATE_FORMAT(ended_at, '%Y-%m') = ?`,
                [req.user, month]
            );

            return ReturnData(res, rows);

        } else if (limit) {
            if (!ValidateNumber(limit)) return Error(res, "Invalid limit");

            const [rows] = await db.query(
                `SELECT id, name, DATE_FORMAT(ended_at, '%Y-%m-%d') AS ended_at 
                 FROM workouts w 
                 WHERE user_id = ? 
                 ORDER BY w.ended_at DESC 
                 LIMIT ?`,
                [req.user, Number(limit)]
            );

            return ReturnData(res, rows);
        }

    } catch (e) {
        return dbError(res, e);
    }
};

export const getWorkoutById = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        const [workoutRows] = await db.query(
            `SELECT 
                id, 
                name, 
                TIMESTAMPDIFF(SECOND, started_at, ended_at) AS length, 
                DATE_FORMAT(ended_at, '%H:%i') AS ended_at 
             FROM workouts 
             WHERE id = ?
             AND user_id = ?
             ORDER BY ended_at DESC`,
            [id, req.user]
        );

        const workout = workoutRows[0];
        if (!workout) return NotFound(res, "Workout not found");

        const [rows] = await db.query(
            `SELECT 
                e.id as exercise_id,
                COALESCE(s.exercise_name, e.name) as exercise_name,
                rep,
                weight
             FROM sets s
             LEFT JOIN exercises e ON s.exercise_id = e.id
             WHERE s.workout_id = ?
             ORDER BY s.position`,
            [workout.id]
        );

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

        return ReturnData(res, [{
            id: workout.id, 
            name: workout.name, 
            duration: Number(workout.length),
            ended_at: workout.ended_at,
            exercises: Object.values(exercisesMap)
        }]);

    } catch (e) {
        return dbError(res, e);
    }
};

export const addWorkout = async (req, res) => {
    const { name, started_at, ended_at, plan } = req.body;

    if (!Validate(name)) return Error(res, "Invalid workout name");

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            "INSERT INTO workouts (user_id, name, started_at, ended_at) VALUES (?, ?, ?, ?)",
            [req.user, name, started_at, ended_at]
        );

        const workoutId = result.insertId;

        if (Array.isArray(plan) && plan.length > 0) {
            const insertPromises = [];

            plan.forEach(exercise => {
                if (!exercise.id || typeof exercise.id === "string") {
                    exercise.sets?.forEach(set => {
                        insertPromises.push(
                            connection.query(
                                "INSERT INTO sets (workout_id, exercise_name, rep, weight) VALUES (?, ?, ?, ?)",
                                [workoutId, exercise.name, Number(set.rep), Number(set.weight)]
                            )
                        );
                    });
                } else {
                    exercise.sets?.forEach(set => {
                        insertPromises.push(
                            connection.query(
                                "INSERT INTO sets (workout_id, exercise_id, rep, weight) VALUES (?, ?, ?, ?)",
                                [workoutId, exercise.id, Number(set.rep), Number(set.weight)]
                            )
                        );
                    });
                }
            });

            if (insertPromises.length > 0) {
                await Promise.all(insertPromises);
            }
        }

        await connection.commit();
        return NoContent(res);

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};

export const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        await db.query(
            "DELETE FROM workouts WHERE id = ? AND user_id = ?",
            [id, req.user]
        );
        return NoContent(res);
    } catch (e) {
        return dbError(res, e);
    }
};