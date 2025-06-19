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

// Получение цен за период
app.get('/prices', async (req, res) => {
	const { from, to } = req.query
	let query = 'SELECT * FROM prices'

	if (from && to) {
		query += ` WHERE timestamp BETWEEN '${from}' AND '${to}'`
	}

	const result = await pool.query(query)
	res.json(result.rows)
})

app.listen(PROT, () => {
	console.log(`Backend API running on http://localhost:${port}`)
})
