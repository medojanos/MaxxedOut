import db from "../config/db.js"

import dotenv from 'dotenv';
dotenv.config();



async function getUserFromToken(token) {
    return new Promise((res, rej) => {
        db.get("SELECT user_id FROM tokens WHERE token = ?", [token], (e, row) => {
            if (e) rej(e)
            row ? res(row) : res(null)
        })
    })
}

export function authUser() {
    return async (req, res, next) => {
        try {
            const token = req.headers["authorization"];

            if (!token)
                return res.status(401).json({ success: false, message: "No token" });

            const user = await getUserFromToken(token);

            if (!user)
                return res.status(401).json({ success: false, message: "Invalid token" });

            req.user = user.user_id;

            next();
        } catch {
            res.status(500).json({ success: false, message: "Auth error" });
        }
    };
}

export function authAdmin() {
    return async (req, res, next) => {
        const key = req.headers["authorization"];

        if (!key || key !== process.env.ADMIN_API_KEY) {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }

        next();
    };
}