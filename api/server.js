import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import fs, { stat } from 'fs'
import { hash } from 'crypto'
import { randomBytes } from 'crypto'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbPath = path.join(dirname, 'db', 'maxxedout.db')
const readmePath = path.join(dirname, '..', 'README.md')

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database(dbPath, (e) => {
    if (e) console.error("Database error: ", e)
    else console.log("Database opened successfully")
})

// Open api
app.get("/", (req, res) => {
    res.send("The API is working!")
})

app.get("/readme", (req, res) => {
    fs.readFile(readmePath, "utf-8", (e, text) => {
        res.send(text)
    })
})

app.get("/muscle_groups_exercises", (req, res) => {
    db.all("SELECT * FROM muscle_groups_exercises", (e, rows) => {
        res.json(rows);
    })
})

app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", (e, rows) => {
        res.json(rows);
    })
})

app.post("/register", (req, res) => {
    db.get("SELECT * FROM users WHERE email = ?", [req.body.email], (e, row) => {
        if (row) {
        res.json({message: "Email already registered", status: false});
        } else {
        db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [req.body.email, hash('sha-512', req.body.password)]
        )
        res.json({message : "Successfully registered", status: true});
        }
    })
})

app.post("/login", (req, res) => {
    db.get("SELECT id FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, user) => {
        if (!user) res.json({message: "Wrong credentials", status: false});
        let token = randomBytes(32).toString('hex');
        db.run("INSERT INTO tokens VALUES (?, ?)", [token, user.id]);
        res.json({message: "Successfully logged in", status: true, token : token});
    })
})

// Temp
app.get("/exercises", (req, res) => {
    db.all("SELECT * FROM exercises", (e, rows) => {
        res.json(rows);
    })
})
app.get("/muscle_groups", (req, res) => {
    db.all("SELECT * FROM muscle_groups", (e, rows) => {
        res.json(rows);
    })
})

// Closed api
async function Auth(token) {
    return new Promise((res, rej) => {
        db.get("SELECT user_id FROM tokens WHERE token = ?", [token], (e, row) => {
            if (e) rej(e)
            row ? res(row) : res(null)
        })
    })
}

async function AuthMiddleWare(req, res, next) {
    const auth = await Auth(req.headers["authorization"]);
    if (!auth) return res.json({error : "Invalid token"});
    req.user = auth.user_id;
    next(); 
}

// Below this line the apis will be authenticated
app.use(AuthMiddleWare);

app.get("/plans", (req, res) => {
    db.all("SELECT * FROM plans WHERE user_id = ?", [req.user], (e, rows) => {
        res.json(rows);
    })
})

app.patch("/users", (req, res) => {
    let columns = [];
    let columnsData = [];
    if (req.body.nickname) {
        columns.push("nickname");
        columnsData.push(req.body.nickname);
    }
    if (req.body.email) {
        columns.push("email");
        columnsData.push(req.body.email);
    }
    if (req.body.password) {
        columns.push("password");
        columnsData.push(hash("sha-512", req.body.password));
    }
    if (columns.length == 0) res.json({message : "No changes made", status : false})
    columnsData.push(req.user);
        
    const query = "UPDATE users SET " + columns.map((col) => col + " = ?").join(", ") + " WHERE id = ?";
    db.run(query, columnsData, (e) => {
        if (e) return res.json({message : "Something went wrong", status: false})
        res.json({message: "Succesfull profile update", status: true})
    })
})

const PORT = 4000
app.listen(PORT, () => {
    console.log("API listening on http://localhost:" + PORT)
})
