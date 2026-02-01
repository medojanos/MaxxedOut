import db from "../config/db.js"

// App

export const getAllExercises = (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role FROM exercises e LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        const exercisesMap = {};

        
        rows.forEach(row => {
            if (!exercisesMap[row.id]) {
                exercisesMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                    muscle_groups: {}
                };
            }

            if (row.role) {
                if (!exercisesMap[row.id].muscle_groups[row.role]) {
                    exercisesMap[row.id].muscle_groups[row.role] = [];
                }
                exercisesMap[row.id].muscle_groups[row.role].push(row.muscle_group);
            }

        });

        return res.json({success: true, data: Object.values(exercisesMap)});
    })  
}

export const getExerciseById = (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role FROM exercises e LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id LEFT JOIN muscle_groups mg ON mg.id=mge.muscle_group_id WHERE e.id=?", [req.params.id], (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        const musclegroupsMap = {};

        rows.forEach(row => {
            if (row.role) {
                if (!musclegroupsMap[row.role]) musclegroupsMap[row.role] = [];
                musclegroupsMap[row.role].push(row.muscle_group);
            }
            
        });

        return res.json({success: true, data: {type: rows[0].type, muscle_groups: musclegroupsMap, name: rows[0].name}});
    })
}

// Admin

export const getAllExercisesAdmin = (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group_name, mge.role as role, mg.id as muscle_group_id FROM exercises e LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});

        const exercisesMap = {};
        
        rows.forEach(row => {
            if (!exercisesMap[row.id]) {
                exercisesMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    type: row.type,
                    musclesworked: []
                };
            }

            if (row.muscle_group_id) {
                exercisesMap[row.id].musclesworked.push({
                    musclegroup: {
                        id: row.muscle_group_id,
                        name: row.muscle_group_name
                    },
                    role: row.role
                });
            }

        });

        return res.json({success: true, data: Object.values(exercisesMap)});
    })  
}

export const addExercise = (req, res) => {
    db.run("INSERT INTO exercises (name, type) VALUES (?, ?)", [req.body.name, req.body.type], function (e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 

        const exerciseId = this.lastID;
        let completed = 0;
        let responded = false;

        req.body.musclesworked.forEach(mg => {
            db.run("INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)", [mg.id, exerciseId, mg.role], function(e) {
                if(responded) return;
                
                if (e)
                {
                    responded = true;
                    return res.status(500).json({success: false, message: "Database error"});
                } 

                completed++;
        
                if(completed == req.body.musclesworked.length) {
                    responded = true;
                    return res.json({success: true, message: "Exercise added successfully!"});
                }
            })
        });
    })
}

export const updateExercise = (req, res) => {
    db.run("UPDATE exercises SET name = ?, type = ? WHERE id = ?", [req.body.name, req.body.type, req.body.id], function (e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Exercise not found!"
            });
        }
        
        db.run("DELETE FROM muscle_groups_exercises WHERE exercise_id = ?", req.body.id, function(e) {
            if (e) return res.status(500).json({success: false, message: "Database error"}); 

            let completed = 0;
            let responded = false;

            req.body.musclesworked.forEach(mg => {
                db.run("INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)", [mg.id, req.body.id, mg.role], function(e) {
                    if(responded) return;
                    
                    if (e) 
                    {
                        responded = true;
                        return res.status(500).json({success: false, message: "Database error"}); 
                    }

                    completed ++;

                    if(completed == req.body.musclesworked.length) {
                        responded = true;
                        return res.json({success: true, message: "Exercise updated successfully!"});
                    }
                })
            });
        })
    })
}

export const deleteExercise = (req, res) => {
        db.run("DELETE FROM exercises WHERE id = ?", req.params.id, function (e) {
            if (e) return res.status(500).json({success: false, message: "Database error"}); 
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Exercise not found!"
                });
            }
            
            db.run("DELETE FROM muscle_groups_exercises WHERE exercise_id = ?", req.params.id, function(e) {
                if (e) return res.status(500).json({success: false, message: "Database error"}); 
            })

            return res.json({success: true, message: "Exercise deleted successfully!"});
    })
}