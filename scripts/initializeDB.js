const { Pool } = require('pg')
const  dotenv = require('dotenv')
const fs = require('fs')

const initializeDB = async () => {
  dotenv.config({ path: './.env' })
  const pool = new Pool()
  const sql = fs.readFileSync('./sql/tables.sql', { encoding: 'utf-8' })
  await pool.query(sql)
  console.log('Database initialized')
}

initializeDB()
