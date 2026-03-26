import db from "../config/db.js"
import { ReturnData, Validate, Error, dbError, ValidateNumber, Success, NotFound } from "../config/res.js";

// App

export const getAllMuscleGroups = (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        if (e) return dbError(res);
        ReturnData(res, rows);
    })  
}

// Admin

export const addMuscleGroup = (req, res) => {
    const { name } = req.body;

    if (!Validate(name)) return Error(res, "Invalid name");

    db.run("INSERT INTO muscle_groups (name) VALUES (?)", name, function(e) {
        if (e) return dbError(res); 
        return res.status(201).json({success: true, data: {id: this.lastID}});
    });
}

export const updateMuscleGroup = (req, res) => {
    const { name, id } = req.body;

    if (!Validate(name)) return Error(res, "Invalid name");
    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    db.run("UPDATE muscle_groups SET name=? WHERE id=?", [name, id], function(e) {
        if (e) return dbError(res); 
        if (this.changes === 0) return NotFound(res, "Muscle group not found")
        Success(res, "Updated muscle group")
    })
}

export const deleteMuscleGroup = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id")

    db.run("DELETE FROM muscle_groups WHERE id=?", id, function(e) {
        if (e) return dbError(res); 
        if (this.changes === 0) return NotFound(res, "Muscle group not found");
        Success(res, "Deleted muscle group");
    })
}
