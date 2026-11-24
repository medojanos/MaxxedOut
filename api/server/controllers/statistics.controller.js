import db from "../config/db.js"
import { dbError, ReturnData } from "../config/utility.js";

export const getStatistics = async (req, res) => {    
    try {
        const [workoutRows] = await db.query(
            `SELECT
                SUM(TIMESTAMPDIFF(SECOND, started_at, ended_at) / 60.0) AS total_duration, 
                COUNT(*) AS total_workouts,
                AVG(TIMESTAMPDIFF(SECOND, started_at, ended_at) / 60.0) AS avg_duration
             FROM workouts
             WHERE user_id = ?`,
            [req.user]
        );
        const workouts = workoutRows[0];

        const [setRows] = await db.query(
            `SELECT 
                SUM(s.weight * s.rep) AS total_weight
             FROM sets s
             JOIN workouts w ON s.workout_id = w.id
             WHERE w.user_id = ?`,
            [req.user]
        );
        const sets = setRows[0];

        const [dates] = await db.query(
            `SELECT DISTINCT
                YEAR(ended_at) as year, 
                WEEK(ended_at, 1) as week
            FROM workouts
            WHERE user_id = ? AND ended_at IS NOT NULL
            ORDER BY year DESC, week DESC`,
            [req.user]
        );

        return ReturnData(res, {
            totalWorkouts: Number(workouts.total_workouts) || 0,
            totalDuration: Math.round(Number(workouts.total_duration)) || 0,
            avgDuration: Math.round(Number(workouts.avg_duration)) || 0,
            workoutStreak: countStreak(dates) || 0,
            totalWeight: Number(sets.total_weight) || 0
        });

    } catch (e) {
        return dbError(res, e);
    }
};

export const getAllExercisesWithStats = async (req, res) => { 
    try {
        const [exercises] = await db.query(
            `SELECT id, name, weight, reps, one_rep_max
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
             ) AS ranked_sets
             WHERE rn = 1`,
            [req.user]
        );

        return ReturnData(res, exercises);

    } catch (e) {
        return dbError(res, e);
    }
};

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