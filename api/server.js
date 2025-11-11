import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { hash } from 'crypto'

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

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (e, rows) => {
    res.send(rows);
  });
})

app.get("/exercises", (req, res) => {
  db.all("SELECT * FROM exercises", (e, rows) => {
    res.send(rows);
  });
})

app.post("/register", (req, res) => {
  db.get("SELECT * FROM users WHERE email = '" + req.body.email + "'", (e, row) => {
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
  db.get("SELECT * FROM users WHERE email = '" + req.body.email + "'", (e, row) => {
    if (row) {
      db.get("SELECT * FROM users WHERE email = '" + req.body.email + "' AND password = '" + hash("sha-512", req.body.password) + "'", (e, row) => {
        if (row) {
          res.json({message: "Successfully logged in", status: true})
        } else {
          res.json({message: "Wrong password", status: false})
        }
      })
    } else {
      res.json({message: "No email registered", status: false})
    }
  });
})

const PORT = 4000
app.listen(PORT, () => {
  console.log("API listening on http://localhost:" + PORT)
})
