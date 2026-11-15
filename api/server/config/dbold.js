import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbPath = path.join(dirname, '..', '..', 'db', 'maxxedout.db')

const db = new sqlite3.Database(dbPath, (e) => {
    if (e) return console.error("Database error: ", e)
    db.run("PRAGMA foreign_keys = ON;")
    console.log("Database opened successfully")
})

export default db;