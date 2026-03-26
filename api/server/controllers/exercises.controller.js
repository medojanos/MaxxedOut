import db from "../config/db.js"
import { ReturnData, Validate, Error, dbError, Success, ValidateNumber, ValidateArray, NotFound } from "../config/utility.js";

// App

export const getAllExercises = (req, res) => {
    db.all(`SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role 
        FROM exercises e 
        LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id 
        LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id`, (e, rows) => {
        if (e) return dbError(res);

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

        ReturnData(res, Object.values(exercisesMap))
    })  
}

export const getExerciseById = (req, res) => {
    const { id } = req.params;
    
    if(!ValidateNumber(id)) return Error(res, "Invalid id");

    db.all(`SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role 
        FROM exercises e 
        LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id 
        LEFT JOIN muscle_groups mg ON mg.id=mge.muscle_group_id WHERE e.id=?`, id, (e, rows) => {
        if (e) return dbError(res);

        const musclegroupsMap = {};

        rows.forEach(row => {
            if (row.role) {
                if (!musclegroupsMap[row.role]) musclegroupsMap[row.role] = [];
                musclegroupsMap[row.role].push(row.muscle_group);
            }
        });

        ReturnData(res, {type: rows[0].type, muscle_groups: musclegroupsMap, name: rows[0].name});
    })
}

// Admin

export const getAllExercisesAdmin = (req, res) => {
    db.all(`SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group_name, mge.role as role, mg.id as muscle_group_id 
        FROM exercises e 
        LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id 
        LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id`, (e, rows) => {
        if (e) return dbError(res);

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

        ReturnData(res, Object.values(exercisesMap));
    })  
}

export const addExercise = (req, res) => {
    const { name, type, musclesworked } = req.body;

    if(!Validate(name)) return Error(res, "Invalid exercise name");
    if(!Validate(type)) return Error(res, "Invalid type");
    if(!ValidateArray(musclesworked)) return Error(res, "Invalid muscles worked");

    db.run("INSERT INTO exercises (name, type) VALUES (?, ?)", [name, type], function (e) {
        if (e) return dbError(res); 

        const exerciseId = this.lastID;
        let completed = 0;
        let responded = false;

        musclesworked.forEach(mg => {
            db.run("INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)", [mg.id, exerciseId, mg.role], function(e) {
                if(responded) return;
                
                if (e) {
                    responded = true;
                    return dbError(res);
                } 

                completed++;
        
                if(completed == musclesworked.length) {
                    responded = true;
                    return Success(res, "Added exercise");
                }
            })
        });
    })
}

export const updateExercise = (req, res) => {    
    const { id, name, type, musclesworked } = req.body;

    if(!ValidateNumber(id)) return Error(res, "Invalid id");
    if(!Validate(name)) return Error(res, "Invalid exercise name");
    if(!Validate(type)) return Error(res, "Invalid type");
    if(!ValidateArray(musclesworked)) return Error(res, "Invalid muscles worked");

    db.run("UPDATE exercises SET name = ?, type = ? WHERE id = ?", [name, type, id], function (e) {
        if (e) return dbError(res); 
        if (this.changes === 0) return NotFound(res, "Exercise not found!");
        
        db.run("DELETE FROM muscle_groups_exercises WHERE exercise_id = ?", id, function(e) {
            if (e) return dbError(res); 

            let completed = 0;
            let responded = false;

            musclesworked.forEach(mg => {
                if(!ValidateNumber(mg.id)) return NotFound(res, "Exercise not found!");
                if(!Validate(mg.role)) return Error(res, "Invalid muscle role!");

                db.run("INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)", [mg.id, id, mg.role], function(e) {
                    if(responded) return;
                    
                    if (e) {
                        responded = true;
                        return dbError(res); 
                    }

                    completed ++;

                    if(completed == musclesworked.length) {
                        responded = true;
                        return Success(res, "Exercise updated successfully!");
                    }
                })
            });
        })
    })
}

export const deleteExercise = (req, res) => {
    const { id } = req.params;
    
    if(!ValidateNumber(id)) return Error(res, "Invalid id");

    db.run("DELETE FROM exercises WHERE id = ?", id, function (e) {
        if (e) return dbError(res); 
        if (this.changes === 0) return NotFound(res, "Exercise not found!");
        
        db.run("DELETE FROM muscle_groups_exercises WHERE exercise_id = ?", id, function(e) {
            if (e) return dbError(res); 
        })

        return Success(res, "Exercise deleted successfully!");
    })
}