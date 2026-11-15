import db from "../config/db.js"
import { ReturnData, Validate, Error, dbError, ValidateNumber, NotFound, NoContent } from "../config/utility.js";

// App

export const getAllMuscleGroups = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM muscle_groups");
        return ReturnData(res, rows);
    } catch (e) {
        return dbError(res, e);
    }
};

// Admin

export const addMuscleGroup = async (req, res) => {
    const { name } = req.body;

    if (!Validate(name)) return Error(res, "Invalid name");

    try {
        const [result] = await db.query(
            "INSERT INTO muscle_groups (name) VALUES (?)",
            [name]
        );
        return res.status(201).json({ data: { id: result.insertId } });
    } catch (e) {
        return dbError(res, e);
    }
};

export const updateMuscleGroup = async (req, res) => {
    const { name, id } = req.body;

    if (!Validate(name)) return Error(res, "Invalid name");
    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        const [result] = await db.query(
            "UPDATE muscle_groups SET name = ? WHERE id = ?",
            [name, id]
        );
        if (result.affectedRows === 0) return NotFound(res, "Muscle group not found");
        return NoContent(res);
    } catch (e) {
        return dbError(res, e);
    }
};

export const deleteMuscleGroup = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        const [result] = await db.query(
            "DELETE FROM muscle_groups WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) return NotFound(res, "Muscle group not found");
        return NoContent(res);
    } catch (e) {
        return dbError(res, e);
    }
};