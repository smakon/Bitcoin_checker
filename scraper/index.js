const axios = require('axios')
const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'db',
	database: 'bitcoin_db',
	password: 'password',
	port: 5432,
})
