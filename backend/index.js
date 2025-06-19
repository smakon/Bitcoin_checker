const express = require('express')
const { Pool } = require('pg') // Используем PostgreSQL
const cors = require('cors')

const app = express()
const PORT = 3001

// Подключение к БД
const pool = new Pool({
	user: 'postgres',
	host: 'db',
	database: 'bitcoin_db',
	password: 'password',
	port: 5432,
})

app.use(cors())


app.listen(PROT, () => {
	console.log(`Backend API running on http://localhost:${port}`)
})
