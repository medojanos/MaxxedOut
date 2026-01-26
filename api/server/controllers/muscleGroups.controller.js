import db from "../config/db.js"

// App

export const getAllMuscleGroups = (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json({success: true, data: rows});
    })  
}

// Admin

export const addMuscleGroup = (req, res) => {

}

export const updateMuscleGroup = (req, res) => {

}

export const deleteMuscleGroup = (req, res) => {
    
}
