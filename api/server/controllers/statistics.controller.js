import db from "../config/db.js"
import { dbError, ReturnData } from "../config/utility.js";

export const getStatistics = (req, res) => {    
    db.get(`
        SELECT
        SUM((strftime('%s', ended_at) - strftime('%s', started_at)) / 60.0) AS total_duration, 
        COUNT(*) AS total_workouts,
        AVG((strftime('%s', ended_at) - strftime('%s', started_at)) / 60.0) AS avg_duration
        FROM workouts
        WHERE user_id = ?`, [req.user], (e, workouts) => {
        if (e) return dbError(res, e);
        db.get(`SELECT 
            SUM(s.weight * s.rep) AS total_weight
            FROM sets s
            JOIN workouts w ON s.workout_id = w.id
            WHERE w.user_id = ?`, [req.user], (e, sets) => {
            if (e) return dbError(res, e);

            db.all(`
                SELECT DISTINCT
                strftime('%Y', ended_at) as year, 
                strftime('%W', ended_at) as week
                FROM workouts
                WHERE user_id = ?
                ORDER BY year DESC, week DESC`, [req.user], (e, dates) => {
                    if (e) return dbError(res, e);
                    ReturnData(res, {
                        totalWorkouts: workouts.total_workouts || 0,
                        totalDuration: Math.round(workouts.total_duration) || 0,
                        avgDuration: Math.round(workouts.avg_duration) || 0,
                        workoutStreak: countStreak(dates) || 0,
                        totalWeight: sets.total_weight || 0
                    })
            })
        });
    });
}

export const getAllExercisesWithStats = (req, res) => { 
    db.all(`
        SELECT id, name, weight, reps, one_rep_max
        FROM (
            SELECT
                e.id,
                e.name,
                s.weight,
                s.rep AS reps,
                CASE
                    WHEN s.rep >= 15 THEN s.weight
                    ELSE ROUND(s.weight / (1.0278 - 0.0278 * s.rep))
                END AS one_rep_max,
                ROW_NUMBER() OVER (
                    PARTITION BY e.id
                    ORDER BY
                        CASE
                            WHEN s.rep >= 15 THEN s.weight
                            ELSE ROUND(s.weight / (1.0278 - 0.0278 * s.rep))
                        END DESC
                ) AS rn
            FROM sets s
            JOIN workouts w ON s.workout_id = w.id
            JOIN exercises e ON s.exercise_id = e.id
            WHERE w.user_id = ?
        )
        WHERE rn = 1
    `, [req.user], (e, exercises) => {
        if (e) return dbError(res, e);
        ReturnData(res, exercises);
    })
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