import db from "../config/db.js"
import { createHash, randomBytes } from 'crypto'
import {transporter, createEmail} from "../config/mail.js";
import { Validate, ValidateNumber, ValidatePassword, Error, dbError, Unauthorized, Success, ReturnData, NotFound, NoContent  } from "../config/utility.js";
import bcrypt from "bcrypt";

export const Register = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!ValidatePassword(password)) return Error(res, "Invalid password"); 

    db.get("SELECT * FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError(res, e);
        if (row) return Error(res, "Email already registered");
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, bcrypt.hashSync(password, 10)], (e) => {
            if (e) return dbError(res, e);
            Success(res, "Successfully registered");
        })
    }) 
}

export const Login = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  

    db.get("SELECT id, email, nickname, password FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError(res, e);
        if (!row) return NotFound(res, "Email not found");

        const authorized = bcrypt.compareSync(password, row.password);
        if (!authorized) return Unauthorized(res);

        const refresh_token = randomBytes(64).toString('hex');
        const access_token = randomBytes(32).toString('hex');

        function rollback(res, e) {
            db.run("ROLLBACK");
            dbError(res, e);
            return;
        }

        db.run("BEGIN TRANSACTION");
        db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [row.id], e => {
            if (e) return rollback(res, e);
            db.run("DELETE FROM access_tokens WHERE user_id = ?", [row.id], e => {
                if (e) return rollback(res, e);
                db.run("INSERT INTO refresh_tokens (token, user_id, expiry) VALUES (?, ?, ?)", [createHash('sha256').update(refresh_token).digest('hex'), row.id, Date.now() + 30 * 24 * 60 * 60 * 1000], e => {
                    if (e) return rollback(res, e);
                    db.run("INSERT INTO access_tokens (token, user_id, expiry) VALUES (?, ?, ?)", [createHash('sha256').update(access_token).digest('hex'), row.id, Date.now() + 5 * 1000], (e) => {
                        if (e) return rollback(res, e);
                        db.run("COMMIT", e => {
                            if (e) return rollback(res, e);
                            ReturnData(res, {refresh_token : refresh_token, access_token : access_token, email : row.email, nickname : row.nickname});
                        });
                    });
                });
            })
        })
    })
}

export const RefreshToken = (req, res) => {
    const refresh_token = req.headers["authorization"];
    if (!Validate(refresh_token)) return Error(res, "Invalid token");

    db.get("SELECT user_id, expiry FROM refresh_tokens WHERE token = ?", [createHash('sha256').update(refresh_token).digest('hex')], (e, row) => {
        if (e) return dbError(res, e);
        if (!row) return Unauthorized(res);
        
        const new_access_token = randomBytes(32).toString('hex');
        const new_refresh_token = randomBytes(64).toString('hex');

        if (Date.now() > row.expiry) return Unauthorized(res);

        function rollback(res, e) {
            db.run("ROLLBACK");
            dbError(res, e);
            return;
        }

        db.run("BEGIN TRANSACTION");
        db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [row.user_id], e => {
            if (e) return rollback(res, e);
            db.run("DELETE FROM access_tokens WHERE user_id = ?", [row.user_id], e => {
                if (e) return rollback(res, e);
                db.run("INSERT INTO refresh_tokens (token, user_id, expiry) VALUES (?, ?, ?)", [createHash('sha256').update(new_refresh_token).digest('hex'), row.user_id, Date.now() + 30 * 24 * 60 * 60 * 1000], e => {
                    if (e) return rollback(res, e);
                    db.run("INSERT INTO access_tokens (token, user_id, expiry) VALUES (?, ?, ?)", [createHash('sha256').update(new_access_token).digest('hex'), row.user_id, Date.now() + 5 * 1000], (e) => {
                        if (e) return rollback(res, e);
                        db.run("COMMIT", e => {
                            if (e) return rollback(res, e);
                            ReturnData(res, {refresh_token : new_refresh_token, access_token : new_access_token});
                        });
                    });
                });
            })
        })
    })
}

export const forgotPassword = (req, res) => {
    const { email } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  

    db.get("SELECT id FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError(res, e);
        if (!row) return NotFound(res, "Email not found");

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        db.run("INSERT INTO codes (user_id, code, expiry) VALUES (?, ?, ?)", [row.id, code, Date.now() + 60 * 60 * 1000], async (e) => {
            if (e) return dbError(res, e);
            try {
                await transporter.sendMail({
                    from: `"MaxxedOut" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "Password Recovery Code",
                    html: createEmail(
                        "Password Recovery Code", 
                        "Your password recovery code is: ",
                        "Please do not share it with anyone!",  
                        code),
                    text: `Your password recovery code is: ${code} Please do not share it with anyone!`
                });

                Success(res, "Email sent");
            } catch (error) {
                return Error(res, "Failed to send email!");
            }
        })
    })
}

export const resetPassword = (req, res) => {
    const { email, code, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!ValidateNumber(code)) return Error(res, "Invalid code");  
    if(!ValidatePassword(password)) return Error(res, "Invalid password");  

    db.get("SELECT c.code, u.id FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [email], (e, row) => {
        if (e) return dbError(res, e);
        if (!row || row.code !== code) return Error(res, "Invalid code");
        db.run("UPDATE users SET password = ? WHERE id = ?", [bcrypt.hashSync(password, 10), row.id], (e) => {
            if (e) return dbError(res, e);
            Success(res, "Password restored succesfully");
        })
    })
}

export const verifyCode = (req, res) => {
    const { email, code } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!Validate(code)) return Error(res, "Invalid code");  

    db.get("SELECT c.code as code, expiry, ? as now FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [Date.now(), email], (e, row) => {
        if (e) return dbError(res, e);
        if (!row || row.code !== code) return Error(res, "Invalid code");
        if (row.now > row.expiry) return Error(res, "Expired code");
        NoContent(res);
    })
}

export const deleteUser = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email"); 

    db.get("SELECT id, password FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError(res, e);
        if (!row) return Unauthorized(res);
        if (!bcrypt.compareSync(password, row.password)) return Unauthorized(res);
        db.run("DELETE FROM users WHERE id = ?", [row.id], (e) => {
            if (e) return dbError(res, e);
            Success(res, "Account deleted succesfully");
        })
    })
}

export const updateUser = (req, res) => {
    const { nickname, email, password, currentPassword } = req.body;

    function update(column, columnData) {
        if(columnData.trim().length === 0) return Error(res, "Invalid " + column);
        db.run(`UPDATE users SET ${column} = ? WHERE id = ?`, [columnData, req.user], (e) => {
            if (e) return dbError(res, e);
            db.get("SELECT email, nickname FROM users WHERE id = ?", [req.user], (e, row) => {
                if (e) return dbError(res, e);
                res.status(201).json({success : true, message : "Profile updated succesfully", data : row});
            })
        })
    }

    if (nickname) return update("nickname", nickname);
    if (email) return update("email", email);
    if (password) {
        return db.get("SELECT id, password FROM users WHERE id = ?", [req.user], (e, row) => {
            if (e) return dbError(res, e);
            if (!row) return Unauthorized(res);
            if (!bcrypt.compareSync(currentPassword, row.password)) return Unauthorized(res);
            update("password", bcrypt.hashSync(password, 10));
        })
    }

    Error(res, "No changes made");
}

// Admin

export const getUsers = (req, res) => {
    db.all("SELECT id, nickname, email FROM users", (e, rows) => {
        if (e) return dbError(res, e);
        ReturnData(res, rows);
    })
}

export const addUser = (req, res) => {
    const { nickname, email, password } = req.body;

    if(!Validate(nickname)) return Error(res, "Invalid nickname");  
    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if (!ValidatePassword(password)) return Error(res, "Invalid password");  

    db.run("INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)", [nickname, email, bcrypt.hashSync(password, 10)], function (e) {
        if (e) return dbError(res, e);
        NoContent(res);
    });
}

export const updateUserFromId = (req, res) => {
    const { nickname, email, password, id } = req.body;

    if(!Validate(nickname)) return Error(res, "Invalid nickname");  
    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!ValidateNumber(id)) return Error(res, "Id is required");  

    const fields = ["nickname=?", "email=?"];
    const properties = [nickname, email]

    if (password) 
    {
        if (!ValidatePassword(password)) return Error(res, "Weak password");
        properties.push(bcrypt.hashSync(password, 10));
        fields.push("password=?");
    }

    properties.push(id);

    db.run(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, properties, function (e) {
        if (e) return dbError(res, e);
        if (this.changes === 0) return NotFound(res, "User not found"); 

        db.run("DELETE FROM tokens WHERE user_id=?", id, function(e) {
            if (e) return dbError(res, e);
        })

        NoContent(res);
    })
}

export const deleteUserFromId = (req, res) => {
    const { id } = req.params;

    if(!ValidateNumber(id)) return Error(res, "Invalid id");

    db.run("DELETE FROM users WHERE id=?", id, function (e) {
        if (e) return dbError(res, e);
        if (this.changes === 0) return NotFound(res, "User not found");
        
        db.run("DELETE FROM tokens WHERE user_id=?", id, function(e) {
            if (e) return dbError(res, e);
        })
        
        NoContent(res);
    })
}