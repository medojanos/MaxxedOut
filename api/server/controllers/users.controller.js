import db from "../config/db.js"
import { createHash, randomBytes } from 'crypto'
import { Validate, ValidateNumber, ValidatePassword, Error, dbError, Unauthorized, Success, ReturnData, NotFound, NoContent  } from "../config/utility.js";
import bcrypt from "bcrypt";

export const deleteUser = async (req, res) => {
    const { email, password } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email"); 

    try {
        const [rows] = await db.query(
            "SELECT id, password FROM users WHERE email = ?",
            [email]
        );

        const row = rows;
        if (!row) return Unauthorized(res);

        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) return Unauthorized(res);

        await db.query(
            "DELETE FROM users WHERE id = ?",
            [row.id]
        );

        return Success(res, "Account deleted succesfully");

    } catch (e) {
        return dbError(res, e);
    }
};

export const updateUser = async (req, res) => {
    const { nickname, email, password, currentPassword } = req.body;

    async function update(column, columnData) {
        if (typeof columnData !== "string" || columnData.trim().length === 0) {
            return Error(res, "Invalid " + column);
        }

        try {
            await db.query(
                `UPDATE users SET ${column} = ? WHERE id = ?`,
                [columnData, req.user]
            );
            return Success(res, "Profile updated succesfully");
        } catch (e) {
            return dbError(res, e);
        }
    }

    if (nickname) return update("nickname", nickname);
    if (email) return update("email", email);

    if (password) {
        try {
            const [rows] = await db.query(
                "SELECT id, password FROM users WHERE id = ?",
                [req.user]
            );

            const row = rows;
            if (!row) return Unauthorized(res);

            if (!currentPassword) return Unauthorized(res);
            const isMatch = await bcrypt.compare(currentPassword, row.password);
            if (!isMatch) return Unauthorized(res);

            const hashedPassword = await bcrypt.hash(password, 10);
            return update("password", hashedPassword);

        } catch (e) {
            return dbError(res, e);
        }
    }

    return Error(res, "No changes made");
};

// Admin

export const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nickname, email FROM users");
        return ReturnData(res, rows);
    } catch (e) {
        return dbError(res, e);
    }
};

export const addUser = async (req, res) => {
    const { nickname, email, password } = req.body;

    if (!Validate(nickname)) return Error(res, "Invalid nickname");  
    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!ValidatePassword(password)) return Error(res, "Invalid password");  

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)",
            [nickname, email, hashedPassword]
        );
        return res.status(201).json({ data: { id: result.insertId } });
    } catch (e) {
        return dbError(res, e);
    }
};

export const updateUserFromId = async (req, res) => {
    const { nickname, email, password, id } = req.body;

    if (!Validate(nickname)) return Error(res, "Invalid nickname");  
    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!ValidateNumber(id)) return Error(res, "Id is required");  

    const fields = ["nickname = ?", "email = ?"];
    const properties = [nickname, email];

    if (password) {
        if (!ValidatePassword(password)) return Error(res, "Weak password");
        const hashedPassword = await bcrypt.hash(password, 10);
        properties.push(hashedPassword);
        fields.push("password = ?");
    }

    properties.push(id);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            properties
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return NotFound(res, "User not found");
        }

        await connection.query("DELETE FROM refresh_tokens WHERE user_id = ?", [id]);
        await connection.query("DELETE FROM access_tokens WHERE user_id = ?", [id]);

        await connection.commit();
        return NoContent(res);

    } catch (e) {
        await connection.rollback();
        return dbError(res, e);
    } finally {
        connection.release();
    }
};

export const deleteUserFromId = async (req, res) => {
    const { id } = req.params;

    if (!ValidateNumber(id)) return Error(res, "Invalid id");

    try {
        const [result] = await db.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) return NotFound(res, "User not found");
        return NoContent(res);
    } catch (e) {
        return dbError(res, e);
    }
};