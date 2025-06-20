const axios = require('axios')

const pool = new Pool({
	user: 'postgres',
	host: '127.127.126.49',
	database: 'postgres',
	password: '',
	port: 5432,
})
// Получение текущей свечи (1 минута)
const fetchBitcoinCandle = async () => {
	try {
		const response = await axios.get(
			'https://binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1',
			{
				headers: {
					'User-Agent': 'BitcoinScraper/1.0',
				},
			}
		)

		const candle = response.data[0]

		const timestamp = new Date(parseInt(candle[0]))
		const open = parseFloat(candle[1])
		const high = parseFloat(candle[2])
		const low = parseFloat(candle[3])
		const close = parseFloat(candle[4])

		console.log(
			`Свеча: ${timestamp} | O: ${open}, H: ${high}, L: ${low}, C: ${close}`
		)

		// Сохранение в таблицу "prices"
		await pool.query(
			`INSERT INTO prices (timestamp, open_price, high_price, low_price, close_price)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (timestamp) DO NOTHING`,
			[timestamp, open, high, low, close]
		)
	} catch (error) {
		console.error('Ошибка при получении данных с Binance:', error.message)
	}
}

// Запуск каждые 5 минут
setInterval(fetchBitcoinCandle, 5 * 60 * 1000)

// Первый запуск
fetchBitcoinCandle()
