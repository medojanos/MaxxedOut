import db from "../config/db.js"
import { hash, randomBytes } from 'crypto'
import "../config/mail.js"

// App

export const Register = (req, res) => {
    db.get("SELECT * FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (row) { 
            return res.status(401).json({
                success: false, 
                message: "Email already registered!"
            }); 
        }
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [req.body.email, hash('sha-512', req.body.password)], (e) => {
            if (e) return res.status(500).json({ success: false, message: "Database error"});
            res.json({success: true, message : "Successfully registered"});
        })
    }) 
}

export const Login = (req, res) => {
    db.get("SELECT id, email, nickname FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) { 
            return res.status(401).json({
                success: false, 
                message: "Invalid credentials"
            });
        }
        let token = randomBytes(32).toString('hex');
        db.run("INSERT INTO tokens (token, user_id) VALUES (?, ?)", [token, row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Successfully logged in", data : {token : token, userData: {email : row.email, nickname : row.nickname}}});
        });
    })
}

export const forgotPassword = (req, res) => {
    db.get("SELECT id FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) { 
            return res.status(404).json({
                success: false, 
                message: "Email not found!"
            }); 
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        db.run("INSERT INTO codes (user_id, code) VALUES (?, ?)", [row.id, code], async (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            try {
                await transporter.sendMail({
                    from: `"MaxxedOut" <${process.env.EMAIL_USER}>`,
                    to: req.body.email,
                    subject: "Password Recovery Code",
                    text: `Your password recovery code is: ${code}`,
                    html: `<h3>Your reset code is: ${code}</h3>`,
                });
                res.json({ success: true, message: "Email sent!" });
            } catch (error) {
                res.status(500).json({ success: false, message: "Failed to send email!" });
            }
        })
    })
}

export const resetPassword = (req, res) => {
    db.get("SELECT c.code, u.id FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row || row.code !== req.body.code) return res.status(400).json({success: false, message: "Invalid code"});
        db.run("UPDATE users SET password = ? WHERE id = ?", [hash("sha-512", req.body.password), row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Password reset succesfully"});
        })
    })
}

export const verifyCode = (req, res) => {
    db.get("SELECT c.code as code, expiry, DATETIME('now') as now FROM codes c JOIN users u ON c.user_id = u.id WHERE u.email = ? ORDER BY c.expiry DESC LIMIT 1", [req.body.email], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row || row.code !== req.body.code) return res.status(400).json({success: false, message: "Invalid code"});
        if (row.now > row.expiry) return res.status(400).json({success: false, message: "Code expired"});
        res.json({success: true, message: "Code verified"});
    })
}

export const deleteUser = (req, res) => {
    db.get("SELECT id FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, row) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
        db.run("DELETE FROM users WHERE id = ?", [row.id], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            res.json({success: true, message: "Account deleted succesfully"});
        })
    })
}

export const updateUser = (req, res) => {
    function update(column, columnData) {
        db.run("UPDATE users SET " + column + " = ? WHERE id = ?", [columnData, req.user], (e) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            db.get("SELECT email, nickname FROM users WHERE id = ?", [req.user], (e, row) => {
                if (e) return res.status(500).json({success: false, message: "Database error"});
                res.status(200).json({success : true, message : "Profile updated succesfully", data : row});
            })
        })
    }

    if (req.body.nickname) return update("nickname", req.body.nickname);
    if (req.body.email) return update("email", req.body.email);
    if (req.body.password) {
        return db.get("SELECT id FROM users WHERE password = ? AND id = ?", [hash("sha-512", req.body.currentPassword), req.user], (e, row) => {
            if (e) return res.status(500).json({success: false, message: "Database error"});
            if (!row) return res.status(401).json({success: false, message: "Invalid credentials"});
            update("password", hash("sha-512", req.body.password))
        })
    }

    res.status(400).json({success: false, message: "No changes made"});
}

// Admin

export const getUsers = (req, res) => {
    db.all("SELECT id, nickname, email FROM users", (e, rows) => {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        return res.json({success: true, data: rows})
    })
}

export const addUser = (req, res) => {
    db.run("INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)", [req.body.nickname, req,body.email, hash("sha-512", req.body.password)], function (e) {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        return res.json({success: true, data: {id: this.lastID}});
    });
}

export const updateUserFromId = (req, res) => {

    if(!req.body.nickname || req.body.nickname.trim().length < 3){
        return res.status(400).json({success: false, message: "Invalid nickname"})
    }

    if(!req.body.email || !req.body.email.includes("@")){
        return res.status(400).json({success: false, message: "Invalid email"})
    }

    const fields = ["nickname=?", "email=?"];
    const properties = [req.body.nickname, req.body.email]

    if (req.body.password) 
    {
        if (req.body.password.length < 8){
            return res.status(400).json({success: false, message: "Weak password"})
        }

        properties.push(hash("sha-512", req.body.password));
        fields.push("password=?");
    }

    properties.push(req.body.id);

    db.run(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, properties, function (e) {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        } 

        db.run("DELETE FROM tokens WHERE user_id=?", req.body.id, function(e) {
            if (e) return res.status(500).json({success: false, message: "Database error"});
        })

        return res.json({success: true, message: "User updated successfully!"});
    })
}

export const deleteUserFromId = (req, res) => {
    db.run("DELETE FROM users WHERE id=?", req.params.id, function (e) {
        if (e) return res.status(500).json({success: false, message: "Database error"});
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        } 
        
        db.run("DELETE FROM tokens WHERE user_id=?", req.params.id, function(e) {
            if (e) return res.status(500).json({success: false, message: "Database error"});
        })
        
        return res.json({success: true, message: "User deleted successfully!"});
    })
}