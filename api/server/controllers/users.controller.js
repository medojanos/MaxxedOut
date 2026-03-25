import db from "../config/db.js"
import { hash, randomBytes } from 'crypto'
import {transporter, createEmail} from "../config/mail.js";
import { Validate, ValidateNumber, ValidatePassword, Error, dbError, Unauthorized, Success, ReturnData  } from "../config/res.js";

export const Register = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  
    if(!Validate(password) || password.length < 8) return Error("Invalid password"); 

    db.get("SELECT * FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError();
        if (row) return Error(res, "Email already registered");
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash('sha-512', password)], (e) => {
            if (e) return dbError();
            res.json({success: true, message : "Successfully registered"});
        })
    }) 
}

export const Login = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!Validate(password)) return Error(res, "Invalid password"); 

    db.get("SELECT id, email, nickname FROM users WHERE email = ? AND password = ?", [email, hash("sha-512", password)], (e, row) => {
        if (e) return dbError();
        if (!row) return Unauthorized();
        let token = randomBytes(32).toString('hex');
        db.run("INSERT INTO tokens (token, user_id) VALUES (?, ?)", [token, row.id], (e) => {
            if (e) return dbError();
            ReturnData(res, {token : token, userData: {email : row.email, nickname : row.nickname}});
        });
    })
}

export const forgotPassword = (req, res) => {
    const { email } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  

    db.get("SELECT id FROM users WHERE email = ?", [email], (e, row) => {
        if (e) return dbError();
        if (!row) return res.status(404).json({success: false, message: "Email not found!"});

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        db.run("INSERT INTO codes (user_id, code) VALUES (?, ?)", [row.id, code], async (e) => {
            if (e) dbError();
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
                res.json({ success: true, message: "Email sent!" });
            } catch (error) {
                res.status(500).json({ success: false, message: "Failed to send email!" });
            }
        })
    })
}

export const resetPassword = (req, res) => {
    const { email, code, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  
    if(!ValidateNumber(code)) return Error("Invalid code");  
    if(!Validate(password) || password.length < 8) return Error("Invalid password");  

    db.get("SELECT c.code, u.id FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [email], (e, row) => {
        if (e) dbError();
        if (!row || row.code !== code) return Error(res, "Invalid code");
        db.run("UPDATE users SET password = ? WHERE id = ?", [hash("sha-512", req.body.password), row.id], (e) => {
            if (e) return dbError();
            res.json({success: true, message: "Password reset succesfully"});
        })
    })
}

export const verifyCode = (req, res) => {
    const { email, code } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  
    if(!Validate(code)) return Error("Invalid code");  

    db.get("SELECT c.code as code, expiry, DATETIME('now') as now FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [email], (e, row) => {
        if (e) dbError();
        if (!row || row.code !== code) return Error(res, "Invalid code");
        if (row.now > row.expiry) return Error(res, "Expired code");
        res.json({success: true, message: "Code verified"});
    })
}

export const deleteUser = (req, res) => {
    const { email, password } = req.body;

    if(!Validate(email) || !email.includes("@")) return Error(res, "Invalid email");  
    if(!Validate(password) || password.length < 8) return Error(res, "Invalid password");

    db.get("SELECT id FROM users WHERE email = ? AND password = ?", [email, hash("sha-512", password)], (e, row) => {
        if (e) dbError();
        if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
        db.run("DELETE FROM users WHERE id = ?", [row.id], (e) => {
            if (e) dbError();
            res.json({success: true, message: "Account deleted succesfully"});
        })
    })
}

export const updateUser = (req, res) => {
    const { nickname, email, password, currentPassword } = req.body;

    function update(column, columnData) {
        if(columnData.trim().length === 0) return Error("Invalid " + column);
        db.run("UPDATE users SET " + column + " = ? WHERE id = ?", [columnData, req.user], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            db.get("SELECT email, nickname FROM users WHERE id = ?", [req.user], (e, row) => {
                if (e) return dbError();
                res.status(200).json({success : true, message : "Profile updated succesfully", data : row});
            })
        })
    }

    if (nickname) return update("nickname", nickname);
    if (email) return update("email", email);
    if (password) {
        return db.get("SELECT id FROM users WHERE password = ? AND id = ?", [hash("sha-512", currentPassword), req.user], (e, row) => {
            if (e) return dbError();
            if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
            update("password", hash("sha-512", password))
        })
    }

    res.status(400).json({success: false, message: "No changes made"});
}

// Admin

export const getUsers = (req, res) => {
    db.all("SELECT id, nickname, email FROM users", (e, rows) => {
        if (e) return dbError();
        ReturnData(res, rows);
    })
}

export const addUser = (req, res) => {
    const {nickname, email, password} = req.body;

    if(!Validate(nickname)) return Error("Invalid nickname");  
    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  
    if (!ValidatePassword(password)) return Error("Invalid password");  

    db.run("INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)", [nickname, email, hash("sha-512", password)], function (e) {
        if (e) return dbError();
        Success(res, "User registered");
    });
}

export const updateUserFromId = (req, res) => {
    const {nickname, email, password, id} = req.body;

    if(!Validate(nickname)) return Error("Invalid nickname");  
    if(!Validate(email) || !email.includes("@")) return Error("Invalid email");  
    if(!ValidateNumber(id)) return Error("Id is required");  

    const fields = ["nickname=?", "email=?"];
    const properties = [nickname, email]


    if (password) 
    {
        if (!ValidatePassword(password)) return Error(res, "Weak password");
        properties.push(hash("sha-512", password));
        fields.push("password=?");
    }

    properties.push(id);

    db.run(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, properties, function (e) {
        if (e) return dbError();
        if (this.changes === 0) return res.status(404).json({success: false, message: "User not found!"}); 

        db.run("DELETE FROM tokens WHERE user_id=?", id, function(e) {
            if (e) return dbError();
        })

        return Success(res, "User updated");
    })
}

export const deleteUserFromId = (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id=?", id, function (e) {
        if (e) return dbError();
        if (this.changes === 0) return res.status(404).json({success: false, message: "User not found!"});
        
        db.run("DELETE FROM tokens WHERE user_id=?", id, function(e) {
            if (e) dbError();
        })
        
        return Success(res, "User deleted");
    })
}