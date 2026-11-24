import db from "../config/db.js"
import { ReturnData, Validate, Error, dbError, Success, ValidateNumber, ValidateArray, NotFound, NoContent } from "../config/utility.js";

// App

export const getAllExercises = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role 
             FROM exercises e 
             LEFT JOIN muscle_groups_exercises mge ON e.id = mge.exercise_id 
             LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id`
        );

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

        return ReturnData(res, Object.values(exercisesMap));

    } catch (e) {
        return dbError(res, e);
    }
};

export const getExerciseById = async (req, res) => {
    const { id } = req.params;
    
    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        const [rows] = await db.query(
            `SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group, mge.role as role 
             FROM exercises e 
             LEFT JOIN muscle_groups_exercises mge ON e.id = mge.exercise_id 
             LEFT JOIN muscle_groups mg ON mg.id = mge.muscle_group_id 
             WHERE e.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NotFound(res, "Exercise not found");
        }

        const musclegroupsMap = {};

        rows.forEach(row => {
            if (row.role) {
                if (!musclegroupsMap[row.role]) musclegroupsMap[row.role] = [];
                musclegroupsMap[row.role].push(row.muscle_group);
            }
        });

        return ReturnData(res, {
            type: rows[0].type,
            muscle_groups: musclegroupsMap,
            name: rows[0].name
        });

    } catch (e) {
        return dbError(res, e);
    }
};

// Admin

export const getAllExercisesAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT e.id as id, e.name as name, e.type as type, mg.name as muscle_group_name, mge.role as role, mg.id as muscle_group_id 
             FROM exercises e 
             LEFT JOIN muscle_groups_exercises mge ON e.id = mge.exercise_id 
             LEFT JOIN muscle_groups mg ON mge.muscle_group_id = mg.id`
        );

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

        return ReturnData(res, Object.values(exercisesMap));

    } catch (e) {
        return dbError(res, e);
    }
};

export const addExercise = async (req, res) => {
    const { name, type, musclesworked } = req.body;

    if (!Validate(name)) return Error(res, "Invalid exercise name");
    if (!Validate(type) || (type !== "Compound" && type !== "Isolation")) return Error(res, "Invalid type");
    if (!Array.isArray(musclesworked)) return Error(res, "Invalid muscles worked");
    if (musclesworked.length !== 0 && !ValidateArray(musclesworked)) {
        return Error(res, "Invalid muscles worked");
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            "INSERT INTO exercises (name, type) VALUES (?, ?)",
            [name, type]
        );

        const exerciseId = result.insertId;

        if (musclesworked.length !== 0) {
            const insertPromises = musclesworked.map(mg => {
                return connection.query(
                    "INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)",
                    [mg.id, exerciseId, mg.role]
                );
            });

            await Promise.all(insertPromises);
        }

        await connection.commit();
        return res.status(201).json({ data: { id: exerciseId } });

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};

export const updateExercise = async (req, res) => {    
    const { id, name, type, musclesworked } = req.body;

    if (!ValidateNumber(id)) return Error(res, "Invalid id");
    if (!Validate(name)) return Error(res, "Invalid exercise name");
    if (!Validate(type) || (type !== "Compound" && type !== "Isolation")) return Error(res, "Invalid type");
    if (!Array.isArray(musclesworked)) return Error(res, "Invalid muscles worked");
    if (musclesworked.length !== 0 && !ValidateArray(musclesworked)) {
        return Error(res, "Invalid muscles worked");
    }

    for (const mg of musclesworked) {
        if (!ValidateNumber(mg.id)) return NotFound(res, "Exercise not found!");
        if (!Validate(mg.role)) return Error(res, "Invalid muscle role!");
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            "UPDATE exercises SET name = ?, type = ? WHERE id = ?",
            [name, type, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return NotFound(res, "Exercise not found!");
        }
        
        await connection.query(
            "DELETE FROM muscle_groups_exercises WHERE exercise_id = ?",
            [id]
        );

        if (musclesworked.length !== 0) {
            const insertPromises = musclesworked.map(mg => {
                return connection.query(
                    "INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES (?, ?, ?)",
                    [mg.id, id, mg.role]
                );
            });

            await Promise.all(insertPromises);
        }

        await connection.commit();
        return NoContent(res);

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};

export const deleteExercise = async (req, res) => {
    const { id } = req.params;
    
    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            "DELETE FROM muscle_groups_exercises WHERE exercise_id = ?",
            [id]
        );

        const [result] = await connection.query(
            "DELETE FROM exercises WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return NotFound(res, "Exercise not found!");
        }

        await connection.commit();
        return NoContent(res);

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};