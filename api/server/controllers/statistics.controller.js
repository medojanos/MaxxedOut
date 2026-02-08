import db from "../config/db.js"

export const getStatistics = (req, res) => {    
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
}