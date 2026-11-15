import db from "../config/db.js"
import {Unauthorized, dbError, Error} from "../config/utility.js"
import { Validate } from "../config/utility.js";
import {createHash} from "crypto";

import dotenv from 'dotenv';
dotenv.config();

async function getUser(token) {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const [rows] = await db.query(
        "SELECT user_id, expiry FROM access_tokens WHERE token = ?",
        [hashedToken]
    );
    return rows.length > 0 ? rows[0] : null;
}

export function authUser() {
    return async (req, res, next) => {
        try {
            const access_token = req.headers["authorization"];
            if (!Validate(access_token)) return Error(res, "Invalid token");

            const user = await getUser(access_token);
            if (!user) return Unauthorized(res);

            if (Date.now() > Number(user.expiry)) return Unauthorized(res);

            req.user = user.user_id;
            next();
        } catch (e) {
            dbError(res, e);
        }
    };
}

export function authAdmin() {
    return async (req, res, next) => {
        const key = req.headers["authorization"];

        if (!key || key !== process.env.ADMIN_API_KEY) {
            return Unauthorized(res);
        }

        next();
    };
}

