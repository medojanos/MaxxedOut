import db from "../config/db.js"
import { createHash, randomBytes } from 'crypto'
import { Validate, ValidateNumber, ValidatePassword, Error, dbError, Unauthorized, Success, ReturnData, NotFound, NoContent  } from "../config/utility.js";
import bcrypt from "bcrypt";

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
        return res.status(201).json({data: {id: this.lastID}});
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