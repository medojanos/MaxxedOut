import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
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

app.get("/", (req, res) => {
  res.send("The API is working!")
})

app.get("/readme", (req, res) => {
  fs.readFile(readmePath, "utf-8", (e, text) => {
    res.send(text)
  })
})

app.get("/plans", (req, res) => {
  db.get("SELECT user_id FROM tokens WHERE token = ?", [req.header("Authorization")], (e, user_id) => {
    db.get("SELECT * FROM plans WHERE user_id = ?", [user_id], (e, plans) => {
      console.log(user_id.user_id);
      res.json(plans);
    })
  })
})

app.get("/exercises", (req, res) => {
  db.all("SELECT * FROM exercises", (e, rows) => {
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
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [req.body.email, hash("sha-512", req.body.password)], (e, row) => {
    if (!row) {
      res.json({message: "Wrong credentials", status: false});
    }
    let token = randomBytes(32).toString('hex');
    db.run("INSERT INTO tokens VALUES (?, ?)", [token, row]);
    res.json({message: "Successfully logged in", status: true, token : token});
  })
})

const PORT = 4000
app.listen(PORT, () => {
  console.log("API listening on http://localhost:" + PORT)
})
