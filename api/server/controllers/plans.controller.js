import db from "../config/db.js"

// App

export const getPlans = (req, res) => {
    db.all("SELECT id, user_id, name FROM plans WHERE user_id = ?", [req.user], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: rows});
    })
}

export const getPlanById = (req, res) => {
    db.all("SELECT e.id as id, COALESCE(pe.exercise_name, e.name) as name, pe.sets as sets FROM plans_exercises pe LEFT JOIN exercises e ON pe.exercise_id = e.id WHERE pe.plan_id = ?", [req.params.id], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        res.json({success: true, data: {plan: rows}});
    })
}

export const getPlanInfo = (req, res) => {
    db.all(
        `SELECT e.id as exercise_id, COALESCE(pe.exercise_name, e.name) as name, e.type as type, pe.sets as sets 
        FROM plans_exercises pe 
        LEFT JOIN exercises e ON pe.exercise_id = e.id 
        WHERE pe.plan_id = ?`,
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

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
                return res.json({
                    success: true,
                    data: {
                        types: Object.values(exerciseTypes),
                        muscle_groups: [],
                        custom: exCustom,
                        totalExercises: rows.length,
                        totalSets: totalSets
                    }
                });
            }

            db.all(
                `SELECT mge.role AS role, mg.name AS muscle_group, pe.sets AS sets 
                FROM plans_exercises pe 
                JOIN muscle_groups_exercises mge ON mge.exercise_id = pe.exercise_id 
                JOIN muscle_groups mg ON mg.id = mge.muscle_group_id 
                WHERE pe.exercise_id IN (${exIds.map(() => "?").join(",")}) AND pe.plan_id = ?`,
                [...exIds, req.params.id],
                (err, mgRows) => {
                    if (err) return res.status(500).json({ success: false, message: "Database error" });

                    mgRows.forEach(row => {
                        if (!musclegroupsMap[row.muscle_group]) {
                            musclegroupsMap[row.muscle_group] = { muscle_group: row.muscle_group, sets: 0 };
                        }
                        if (row.role === "Primary") musclegroupsMap[row.muscle_group].sets += row.sets;
                    });

                    res.json({
                        success: true,
                        data: {
                            types: Object.values(exerciseTypes),
                            muscle_groups: Object.values(musclegroupsMap),
                            custom: exCustom,
                            totalExercises: rows.length,
                            totalSets: totalSets
                        }
                    });
                }
            );
        }
    );
}

export const addPlan = (req, res) => {
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
}

export const updatePlan = (req, res) => {
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
}

export const deletePlan = (req, res) => {
    db.run("DELETE FROM plans WHERE id = ?", [req.params.id], (e) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json({success: true, message: "Plan deleted succesfully"});
    })
}

