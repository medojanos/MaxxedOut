import db from "../config/db.js"
import { Error, dbError, ReturnData, Validate, ValidateNumber, ValidateArray, Created, NoContent } from "../config/utility.js";

// App

export const getPlans = (req, res) => {
    db.all("SELECT id, user_id, name FROM plans WHERE user_id = ?", req.user, (e, rows) => {
        if (e) return dbError(res, e); 
        ReturnData(res, rows);
    })
}

export const getPlanById = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id")

    db.all(`SELECT e.id as id, COALESCE(pe.exercise_name, e.name) as name, pe.sets as sets
        FROM plans_exercises pe 
        JOIN plans p ON p.id = pe.plan_id 
        LEFT JOIN exercises e ON pe.exercise_id = e.id 
        WHERE pe.plan_id = ? AND p.user_id = ?`, [req.params.id, req.user], (e, rows) => {
            if (e) return dbError(res, e); 
            return ReturnData(res, rows);
    })
}

export const getPlanInfo = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid plan id");

    db.all(
        `SELECT e.id as exercise_id, COALESCE(pe.exercise_name, e.name) as name, e.type as type, pe.sets as sets 
        FROM plans_exercises pe 
        JOIN plans p ON p.id = pe.plan_id 
        LEFT JOIN exercises e ON pe.exercise_id = e.id 
        WHERE pe.plan_id = ? AND p.user_id = ?`, [id, req.user], (e, rows) => {
            if (e) return dbError(res, e);

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
                ReturnData(res, {
                    types: Object.values(exerciseTypes),
                    muscle_groups: [],
                    custom: exCustom,
                    totalExercises: rows.length,
                    totalSets: totalSets
                })
            }

            db.all(
                `SELECT mge.role AS role, mg.name AS muscle_group, pe.sets AS sets 
                FROM plans_exercises pe 
                JOIN muscle_groups_exercises mge ON mge.exercise_id = pe.exercise_id 
                JOIN muscle_groups mg ON mg.id = mge.muscle_group_id 
                WHERE pe.exercise_id IN (${exIds.map(() => "?").join(",")}) AND pe.plan_id = ?`, [...exIds, id], (e, mgRows) => {
                    if (e) return dbError(res, e);

                    mgRows.forEach(row => {
                        if (!musclegroupsMap[row.muscle_group]) {
                            musclegroupsMap[row.muscle_group] = { muscle_group: row.muscle_group, sets: 0 };
                        }
                        if (row.role === "Primary") musclegroupsMap[row.muscle_group].sets += row.sets;
                    });

                    ReturnData(res, {
                        types: Object.values(exerciseTypes),
                        muscle_groups: Object.values(musclegroupsMap),
                        custom: exCustom,
                        totalExercises: rows.length,
                        totalSets: totalSets
                    });
                }
            );
        }
    );
}

export const addPlan = (req, res) => {
    const { name, exercises } = req.body;

    if(!Validate(name)) return Error(res, "Invalid plan name");
    if(!ValidateArray(exercises)) return Error(res, "Invalid exercises");

    db.run("INSERT INTO plans (user_id, name) VALUES (?, ?)", [req.user, name], function(e) {
        if (e) return dbError(res, e);

        if (exercises.length === 0) return Created(res, "Created workout plan");
        
        let completed = 0;
        const id = this.lastID;

        function Check(err) {
            if (err) return dbError(res, e); 
            completed++;
            if (completed == exercises.length) return Created(res, "Created workout plan")
        }

        exercises.forEach(exercise => {
            if (typeof exercise.id == "string") {
                db.run("INSERT INTO plans_exercises (plan_id, exercise_name, sets) VALUES (?, ?, ?)", [id, exercise.name, exercise.sets], (e) => Check(e))
            } else {
                db.run("INSERT INTO plans_exercises (plan_id, exercise_id, sets) VALUES (?, ?, ?)", [id, exercise.id, exercise.sets], (e) => Check(e))
            }
        });
    })
}

export const updatePlan = (req, res) => {
    const { name, exercises } = req.body;
    const { id } = req.params;

    if(!Validate(name)) return Error(res, "Invalid plan name");
    if(!ValidateArray(exercises)) return Error(res, "Invalid exercises");
    if(!ValidateNumber(id)) return Error(res, "Invalid plan id");

    db.run("UPDATE plans SET name = ? WHERE id = ?", [name, id], (e) => {
        if (e) return dbError(res, e); 

        db.run("DELETE FROM plans_exercises WHERE plan_id = ?", [id], function(e) {
            if (e) return dbError(res, e);

            let completed = 0;
            
            function Check(err) {
                if (err) return dbError(res, e); 
                completed++;
                if (completed == exercises.length) return NoContent(res);
            }

            exercises.forEach(exercise => {
                if (!exercise.id || typeof exercise.id == "string") {
                    db.run("INSERT INTO plans_exercises (plan_id, exercise_name, sets) VALUES (?, ?, ?)", [id, exercise.name, exercise.sets], (e) => Check(e))
                } else {
                    db.run("INSERT INTO plans_exercises (plan_id, exercise_id, sets) VALUES (?, ?, ?)", [id, exercise.id, exercise.sets], (e) => Check(e))
                }
            });
        })
    })
}

export const deletePlan = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid plan id");

    db.run("DELETE FROM plans WHERE id = ? AND user_id = ?", [id, req.user], (e) => {
        if (e) return dbError(res, e);
        NoContent(res);
    })
}

