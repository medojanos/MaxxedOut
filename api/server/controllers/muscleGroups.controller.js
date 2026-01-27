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
    db.run("INSERT INTO muscle_groups (name) VALUES (?)", [req.body.name], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        return res.status(200).json({success: true, data: {id: this.lastID}});
    });
}

export const updateMuscleGroup = (req, res) => {
    db.run("UPDATE muscle_groups SET name=? WHERE id=?", [req.body.name, req.body.id], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (this.changes === 0) { return res.status(404).json({ success: false, message: "Muscle group not found"}); }
        return res.status(200).json({success: true, message: "Muscle group updated successfully!"});
    })
}

export const deleteMuscleGroup = (req, res) => {
    db.run("DELETE FROM muscle_groups WHERE id=?", [req.body.id], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (this.changes === 0) { return res.status(404).json({ success: false, message: "Muscle group not found"}); }
        return res.status(200).json({success: true, message: "Muscle group deleted successfully!"});
    })
}
