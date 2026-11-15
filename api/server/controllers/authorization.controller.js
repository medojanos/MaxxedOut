import {ReturnData, NoContent, Success} from "../config/utility.js";
import { createHash, randomBytes } from "crypto";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import { transporter, createEmail } from "../config/mail.js";
import { Validate, ValidatePassword, ValidateNumber, Error, dbError, NotFound, Unauthorized } from "../config/utility.js";

export const authU = async (req, res) => {
    NoContent(res);
};

export const authA = async (req, res) => {
    NoContent(res);
};

export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!ValidatePassword(password)) return Error(res, "Invalid password"); 

    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return Error(res, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        return Success(res, "Successfully registered");

    } catch (e) {
        return dbError(res, e);
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  

    let connection;

    try {
        const [rows] = await db.query(
            "SELECT id, email, nickname, password FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];
        if (!user) return Unauthorized(res);

        const authorized = await bcrypt.compare(password, user.password);
        if (!authorized) return Unauthorized(res);

        const refresh_token = randomBytes(64).toString('hex');
        const access_token = randomBytes(32).toString('hex');

        const hashedRefresh = createHash('sha256').update(refresh_token).digest('hex');
        const hashedAccess = createHash('sha256').update(access_token).digest('hex');

        const refreshExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
        const accessExpiry = Date.now() + 10 * 60 * 1000;

        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);
        await connection.query("DELETE FROM access_tokens WHERE user_id = ?", [user.id]);

        await connection.query(
            "INSERT INTO refresh_tokens (token, user_id, expiry) VALUES (?, ?, ?)",
            [hashedRefresh, user.id, refreshExpiry]
        );

        await connection.query(
            "INSERT INTO access_tokens (token, user_id, expiry) VALUES (?, ?, ?)",
            [hashedAccess, user.id, accessExpiry]
        );

        await connection.commit();

        return ReturnData(res, {
            refresh_token: refresh_token,
            access_token: access_token,
            userData: { email: user.email, nickname: user.nickname }
        });

    } catch (e) {
        if (connection) await connection.rollback();
        return dbError(res, e);
    } finally {
        if (connection) connection.release();
    }
};

export const refreshAccessToken = async (req, res) => {
    const refresh_token = req.headers["authorization"];
    if (!Validate(refresh_token)) return Error(res, "Invalid token");

    let connection;

    try {
        const hashedToken = createHash('sha256').update(refresh_token).digest('hex');

        const [rows] = await db.query(
            "SELECT user_id, expiry FROM refresh_tokens WHERE token = ?",
            [hashedToken]
        );

        const row = rows[0];
        if (!row) return Unauthorized(res);

        if (Date.now() > Number(row.expiry)) return Unauthorized(res);

        const new_access_token = randomBytes(32).toString('hex');
        const new_refresh_token = randomBytes(64).toString('hex');

        const hashedNewRefresh = createHash('sha256').update(new_refresh_token).digest('hex');
        const hashedNewAccess = createHash('sha256').update(new_access_token).digest('hex');

        const refreshExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
        const accessExpiry = Date.now() + 10 * 60 * 1000;

        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query("DELETE FROM refresh_tokens WHERE user_id = ?", [row.user_id]);
        await connection.query("DELETE FROM access_tokens WHERE user_id = ?", [row.user_id]);

        await connection.query(
            "INSERT INTO refresh_tokens (token, user_id, expiry) VALUES (?, ?, ?)",
            [hashedNewRefresh, row.user_id, refreshExpiry]
        );

        await connection.query(
            "INSERT INTO access_tokens (token, user_id, expiry) VALUES (?, ?, ?)",
            [hashedNewAccess, row.user_id, accessExpiry]
        );

        await connection.commit();

        return ReturnData(res, {
            refresh_token: new_refresh_token,
            access_token: new_access_token
        });

    } catch (e) {
        if (connection) await connection.rollback();
        return dbError(res, e);
    } finally {
        if (connection) connection.release();
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  

    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        const row = rows[0];
        if (!row) return NotFound(res, "Email not found");

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 15 * 60 * 1000;

        await db.query("DELETE FROM codes WHERE user_id = ?", [row.id]);
        await db.query(
            "INSERT INTO codes (user_id, code, expiry) VALUES (?, ?, ?)",
            [row.id, code, expiry]
        );

        try {
            await transporter.sendMail({
                from: `"MaxxedOut" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Password Recovery Code",
                html: createEmail(
                    "Password Recovery Code", 
                    "Your password recovery code is: ",
                    "The code will expire in 15 minutes. Please do not share it with anyone!",  
                    code
                ),
                text: `Your password recovery code is: ${code} The code will expire in 15 minutes. Please do not share it with anyone!`
            });
            return NoContent(res);
        } catch (error) {
            return Error(res, "Failed to send email!");
        }

    } catch (e) {
        return dbError(res, e);
    }
};

export const resetPassword = async (req, res) => {
    const { email, code, password } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!ValidateNumber(code)) return Error(res, "Invalid code");  
    if (!ValidatePassword(password)) return Error(res, "Invalid password");  

    try {
        const [rows] = await db.query(
            `SELECT c.code, c.expiry, u.id 
             FROM codes c 
             JOIN users u ON c.user_id = u.id 
             WHERE u.email = ? 
             ORDER BY c.expiry DESC LIMIT 1`,
            [email]
        );

        const row = rows;
        if (!row || String(row.code) !== String(code)) {
            return Error(res, "Invalid code");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, row.id]
        );

        await db.query(
            "DELETE FROM codes WHERE user_id = ?",
            [row.id]
        );

        return Success(res, "Password restored succesfully");

    } catch (e) {
        return dbError(res, e);
    }
};

export const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    if (!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!Validate(code)) return Error(res, "Invalid code");  

    try {
        const [rows] = await db.query(
            `SELECT c.code as code, c.expiry as expiry 
             FROM codes c 
             JOIN users u ON c.user_id = u.id 
             WHERE u.email = ? 
             ORDER BY c.expiry DESC LIMIT 1`,
            [email]
        );

        const row = rows;
        if (!row || String(row.code) !== String(code)) {
            return Error(res, "Invalid code");
        }

        if (Date.now() > Number(row.expiry)) {
            return Error(res, "Expired code");
        }

        return NoContent(res);

    } catch (e) {
        return dbError(res, e);
    }
};