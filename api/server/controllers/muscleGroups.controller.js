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
    const { name } = req.body;

    if(!name || typeof name != "string" || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    db.run("INSERT INTO muscle_groups (name) VALUES (?)", name, function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        return res.status(201).json({success: true, data: {id: this.lastID}});
    });
}

export const updateMuscleGroup = (req, res) => {
    const {name, id} = req.body ?? {};

    if(!name || typeof name != "string" || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    if(!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ success: false, message: "Id is required" });
    }

    db.run("UPDATE muscle_groups SET name=? WHERE id=?", [name, id], function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (this.changes === 0) { 
            return res.status(404).json({ 
                success: false, 
                message: "Muscle group not found"
            }); 
        }
        return res.json({success: true, message: "Muscle group updated successfully!"});
    })
}

export const deleteMuscleGroup = (req, res) => {
    const { id } = req.params;

    if(!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ success: false, message: "Id is required" });
    }

    db.run("DELETE FROM muscle_groups WHERE id=?", id, function(e) {
        if (e) return res.status(500).json({success: false, message: "Database error"}); 
        if (this.changes === 0) { 
            return res.status(404).json({ 
                success: false, 
                message: "Muscle group not found"
            }); 
        }
        return res.json({success: true, message: "Muscle group deleted successfully!"});
    })
}
