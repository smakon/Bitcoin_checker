const axios = require('axios')
const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: '127.127.126.49',
	database: 'bitcoin_chacker',
	password: '',
	port: 5432,
})

const fetchBitcoinPrice = async () => {
	try {
		const response = await axios.get(
			'https://api.coindesk.com/v1/bpi/currentprice.json'
		)
		const price = response.data.bpi.USD.rate_float
		const timestamp = new Date()

		await pool.query('INSERT INTO prices (price, timestamp) VALUES ($1, $2)', [
			price,
			timestamp,
		])

		console.log(`Saved price: ${price} at ${timestamp}`)
	} catch (error) {
		console.error('Error fetching Bitcoin price:', error.message)
	}
}

// Запуск каждые 5 минут
setInterval(fetchBitcoinPrice, 5 * 60 * 1000);

// Первый запуск
fetchBitcoinPrice();
