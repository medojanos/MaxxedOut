import db from "../config/db.js"
import { Error, dbError, ReturnData, Validate, ValidateNumber, ValidateArray, Created, NoContent } from "../config/utility.js";

// App

export const getPlans = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, user_id, name FROM plans WHERE user_id = ?", [req.user])
        ReturnData(res, rows);
    }
    catch (e) {
        return dbError(res, e)
    }
}

export const getPlanById = async (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id")

    try {
        const [rows] = await db.query(
            `SELECT e.id as id, COALESCE(pe.exercise_name, e.name) as name, pe.sets as sets, e.type as type
             FROM plans_exercises pe 
             JOIN plans p ON p.id = pe.plan_id 
             LEFT JOIN exercises e ON pe.exercise_id = e.id 
             WHERE pe.plan_id = ? AND p.user_id = ?
             ORDER BY pe.position`,
            [id, req.user]
        );
        return ReturnData(res, rows);
    } catch (e) {
        return dbError(res, e);
    }
}

export const getPlanInfo = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid plan id");

    try {
        const [rows] = await db.query(
            `SELECT e.id as exercise_id, COALESCE(pe.exercise_name, e.name) as name, e.type as type, pe.sets as sets 
            FROM plans_exercises pe 
            JOIN plans p ON p.id = pe.plan_id 
            LEFT JOIN exercises e ON pe.exercise_id = e.id 
            WHERE pe.plan_id = ? AND p.user_id = ?`,
            [id, req.user]
        );

        const exerciseTypes = {};
        const exIds = [];
        let exCustom = 0;
        let totalSets = 0;

        rows.forEach(row => {
            let type;
            if (!row.exercise_id) {
                type = "Custom";
                exCustom += row.sets;
            } else {
                type = row.type;
                exIds.push(row.exercise_id);
            }

            if (!exerciseTypes[type]) {
                exerciseTypes[type] = { type, exercises: 0, sets: 0 };
            }

            exerciseTypes[type].exercises++;
            exerciseTypes[type].sets += row.sets;
            totalSets += row.sets;
        });

        const musclegroupsMap = {};

        if (exIds.length === 0) {
            return ReturnData(res, {
                types: Object.values(exerciseTypes),
                muscle_groups: [],
                custom: exCustom,
                totalExercises: rows.length,
                totalSets: totalSets
            });
        }

        const [mgRows] = await db.query(
            `SELECT mge.role AS role, mg.name AS muscle_group, pe.sets AS sets 
            FROM plans_exercises pe 
            JOIN muscle_groups_exercises mge ON mge.exercise_id = pe.exercise_id 
            JOIN muscle_groups mg ON mg.id = mge.muscle_group_id 
            WHERE pe.exercise_id IN (${exIds.map(() => "?").join(",")}) AND pe.plan_id = ?`,
            [...exIds, id]
        );

        mgRows.forEach(row => {
            if (!musclegroupsMap[row.muscle_group]) {
                musclegroupsMap[row.muscle_group] = { muscle_group: row.muscle_group, sets: 0 };
            }
            if (row.role === "Primary") musclegroupsMap[row.muscle_group].sets += row.sets;
        });

        return ReturnData(res, {
            types: Object.values(exerciseTypes),
            muscle_groups: Object.values(musclegroupsMap),
            custom: exCustom,
            totalExercises: rows.length,
            totalSets: totalSets
        });

    } catch (e) {
        return dbError(res, e);
    }
};

export const addPlan = async (req, res) => {
    const { name, exercises } = req.body;

    if (!Validate(name)) return Error(res, "Invalid plan name");
    if (!ValidateArray(exercises)) return Error(res, "Invalid exercises");

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            "INSERT INTO plans (user_id, name) VALUES (?, ?)",
            [req.user, name]
        );

        const planId = result.insertId;

        if (exercises.length > 0) {
            const insertPromises = exercises.map(exercise => {
                if (typeof exercise.id === "string") {
                    return connection.query(
                        "INSERT INTO plans_exercises (plan_id, exercise_name, sets, position) VALUES (?, ?, ?, ?)",
                        [planId, exercise.name, Number(exercise.sets), exercise.position]
                    );
                } else {
                    return connection.query(
                        "INSERT INTO plans_exercises (plan_id, exercise_id, sets, position) VALUES (?, ?, ?, ?)",
                        [planId, exercise.id, Number(exercise.sets), exercise.position]
                    );
                }
            });

            await Promise.all(insertPromises);
        }

        await connection.commit();
        return Created(res, "Created workout plan");

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};
    
export const updatePlan = async (req, res) => {
    const { name, exercises } = req.body;
    const { id } = req.params;

    if (!Validate(name)) return Error(res, "Invalid plan name");
    if (!ValidateArray(exercises)) return Error(res, "Invalid exercises");
    if (!ValidateNumber(id)) return Error(res, "Invalid plan id");

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            "UPDATE plans SET name = ? WHERE id = ?",
            [name, id]
        );

        await connection.query(
            "DELETE FROM plans_exercises WHERE plan_id = ?",
            [id]
        );

        if (exercises.length > 0) {
            const insertPromises = exercises.map(exercise => {
                if (typeof exercise.id === "string" || !exercise.id) {
                    return connection.query(
                        "INSERT INTO plans_exercises (plan_id, exercise_name, sets, position) VALUES (?, ?, ?, ?)",
                        [id, exercise.name, Number(exercise.sets), exercise.position]
                    );
                } else {
                    return connection.query(
                        "INSERT INTO plans_exercises (plan_id, exercise_id, sets, position) VALUES (?, ?, ?, ?)",
                        [id, exercise.id, Number(exercise.sets), exercise.position]
                    );
                }
            });

            await Promise.all(insertPromises);
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

export const deletePlan = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid plan id");

    try {
        await db.query(
            "DELETE FROM plans WHERE id = ? AND user_id = ?",
            [id, req.user]
        );
        return NoContent(res);
    } catch (e) {
        return dbError(res, e);
    }
};

