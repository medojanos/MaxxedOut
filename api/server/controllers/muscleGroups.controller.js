import db from "../config/db.js"

// App

export const getAllMuscleGroups = (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        res.json(rows);
    })  
}

// Admin


