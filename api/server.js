import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbPath = path.join(dirname, 'db', 'maxxedout.db')
const readmePath = path.join(dirname, '..', 'README.md')

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database(dbPath, (e) => {
  if (e) console.error('Database error:', e)
  else console.log('Database opened successfully')
})

app.get('/', (req, res) => {
  res.send('The API is working!')
})

app.get('/readme', (req, res) => {
  fs.readFile(readmePath, 'utf-8', (e, text) => {
    res.send(text)
  })
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
