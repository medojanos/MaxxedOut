import db from "../config/db.js"
import { dbError, ReturnData } from "../config/res.js";

export const getStatistics = (req, res) => {    
    db.get(`
        SELECT
        SUM((strftime('%s', ended_at) - strftime('%s', started_at)) / 60.0) AS total_duration, 
        COUNT(*) AS total_workouts,
        AVG((strftime('%s', ended_at) - strftime('%s', started_at)) / 60.0) AS avg_duration
        FROM workouts
        WHERE user_id = ?`, [req.user], (e, workouts) => {
        if (e) return dbError(res);

        const maxesLifts = {"squat": 1, 
                            "bench": 2, 
                            "deadlift": 3
        };

        let query = [];

        for (const [key, value] of Object.entries(maxesLifts)) {
            query.push(`
                        (SELECT weight FROM sets 
                        JOIN workouts ON sets.workout_id = workouts.id 
                        WHERE exercise_id = ${value} AND workouts.user_id = ? 
                        ORDER BY weight DESC LIMIT 1) AS max_${key}, 
                        (SELECT rep FROM sets 
                        JOIN workouts ON sets.workout_id = workouts.id 
                        WHERE exercise_id = ${value} AND workouts.user_id = ? 
                        ORDER BY weight DESC, rep DESC LIMIT 1) AS reps_${key}`
            );
        };

        db.get(`SELECT 
            SUM(s.weight * s.rep) AS total_weight,
            ${query.join(", ")}
            FROM sets s
            JOIN workouts w ON s.workout_id = w.id
            WHERE w.user_id = ?`, Array.from({length: 7}, () => req.user), (e, sets) => {
            if (e) return dbError(res);

            db.all(`
                SELECT DISTINCT
                strftime('%Y', ended_at) as year, 
                strftime('%W', ended_at) as week
                FROM workouts
                WHERE user_id = ?
                ORDER BY year DESC, week DESC`, [req.user], (e, dates) => {
                    if (e) return dbError(res);
                    ReturnData(res, {
                        totalWorkouts: workouts.total_workouts || 0,
                        totalDuration: Math.round(workouts.total_duration) || 0,
                        avgDuration: Math.round(workouts.avg_duration) || 0,
                        workoutStreak: countStreak(dates) || 0,
                        totalWeight: sets.total_weight || 0,
                        maxSquat: sets.max_squat || 0,
                        repsSquat: sets.reps_squat || 0,
                        maxBench: sets.max_bench || 0,
                        repsBench: sets.reps_bench || 0,
                        maxDeadlift: sets.max_deadlift || 0,
                        repsDeadlift: sets.reps_deadlift || 0
                    })
            })
        });
    });
}

function countStreak(dates){
    if(dates.length === 0 || !dates) return 0;

    let streak = 0;

    const now = new Date();
    

    let week = weekCount(now);
    let year = now.getFullYear();

    if(week === dates[0].week) {
        streak++;
        week--;
    }

    for (const date of dates) {
        if (week === 0) {
            year--;
            week = weekCount(new Date(year, 11, 31));
        }

        if(Number(date.year) === year && Number(date.week) === week) {
            week--;
            streak++;
        }
        else {
            break;
        }
    };

    return streak;
}

function weekCount(dateParam){
    const date = new Date(dateParam.getTime());
    
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const firstMonday = (7 - (yearStart.getDay() + 6) % 7) % 7;

    const daySince = Math.floor((date - yearStart) / 86400000);

    if(daySince < firstMonday) return 0;

    return Math.floor((daySince - firstMonday) / 7) + 1;
}