const axios = require('axios')
const { Pool } = require('pg')
const { format } = require('date-fns')

const pool = new Pool({
	user: 'postgres',
	host: '127.127.126.49',
	database: 'postgres',
	password: '',
	port: 5432,
})

// Конфигурация
const symbol = 'BTCUSDT'
const interval = '1d' // дневные свечи
const limit = 1000 // максимум за раз
const yearsToImport = 1

// Функция получения timestamp X лет назад
function getTimestampYearsAgo(years) {
	const date = new Date()
	date.setFullYear(date.getFullYear() - years)
	return Math.floor(date.getTime())
}

// Получение исторических данных
async function fetchHistoricalData(startTime, endTime) {
	const url = `https://binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`

	try {
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'BitcoinHistoryImporter/1.0',
			},
		})

		const candles = response.data

		if (candles.length === 0) {
			console.log('Нет данных для указанного диапазона.')
			return []
		}

		// Парсим данные
		const values = candles.map(candle => ({
			timestamp: new Date(parseInt(candle[0])),
			open: parseFloat(candle[1]),
			high: parseFloat(candle[2]),
			low: parseFloat(candle[3]),
			close: parseFloat(candle[4]),
		}))

		return values
	} catch (error) {
		console.error('Ошибка при запросе к Binance:', error.message)
		return []
	}
}

// Сохранение в БД
async function saveToDatabase(data) {
	for (const row of data) {
		const { timestamp, open, high, low, close } = row

		await pool.query(
			`INSERT INTO prices (timestamp, open_price, high_price, low_price, close_price)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (timestamp) DO NOTHING`, // избежание дубликатов
			[timestamp, open, high, low, close]
		)
	}

	console.log(`Добавлено ${data.length} записей в БД`)
}

// Основной процесс
async function importHistory() {
	const startTime = getTimestampYearsAgo(yearsToImport) // 10 лет назад
	const endTime = Date.now() // сейчас

	let currentStart = startTime

	while (currentStart < endTime) {
		const batchEnd = currentStart + 30 * 24 * 60 * 60 * 1000 // ~30 дней
		console.log(
			`Загрузка данных с ${format(currentStart, 'yyyy-MM-dd')} по ${format(
				batchEnd,
				'yyyy-MM-dd'
			)}`
		)

		const data = await fetchHistoricalData(currentStart, batchEnd)

		if (data.length > 0) {
			await saveToDatabase(data)
		}

		currentStart = batchEnd
	}

	console.log('Импорт завершён!')
}

importHistory()
