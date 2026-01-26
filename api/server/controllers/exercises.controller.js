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
        res.json({success: true, data: Object.values(exercisesMap)});
    })  
}

export const getExerciseById = (req, res) => {
    db.all("SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role FROM exercises e LEFT JOIN muscle_groups_exercises mge ON e.id=mge.exercise_id LEFT JOIN muscle_groups mg ON mg.id=mge.muscle_group_id WHERE e.id=?", [req.params.id] , (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        const musclegroupsMap = {};

        rows.forEach(row => {
            if (row.role) {
                if (!musclegroupsMap[row.role]) musclegroupsMap[row.role] = [];
                musclegroupsMap[row.role].push(row.muscle_group);
            }
            
        });

        res.json({success: true, data: {type: rows[0].type, muscle_groups: musclegroupsMap, name: rows[0].name}});
    })
}

// Admin

export const addMuscleGroup = (req, res) => {

}

export const updateMuscleGroup = (req, res) => {

}

export const deleteMuscleGroup = (req, res) => {
    
}

export const addExercise = (req, res) => {

}

export const updateExercise = (req, res) => {

}

export const deleteExercise = (req, res) => {
    
}