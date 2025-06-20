const express = require('express')
const { Pool } = require('pg') // Используем PostgreSQL
const cors = require('cors')

const app = express()
const PORT = 3001

// Подключение к БД
const pool = new Pool({
	user: 'postgres',
	host: 'db',
	database: 'postgres',
	password: '',
	port: 5432,
})

app.use(cors())

// Получение цен за период
app.get('/prices', async (req, res) => {
	const { from, to } = req.query

	let query = 'SELECT * FROM prices ORDER BY timestamp DESC LIMIT 100'

	if (from && to) {
		query = `
      SELECT * FROM prices 
      WHERE timestamp BETWEEN '${from}' AND '${to}'
      ORDER BY timestamp`
	}

	const result = await pool.query(query)
	res.json(result.rows)
})

app.listen(PORT, () => {
	console.log(`Backend API running on http://localhost:${PORT}`)
})
