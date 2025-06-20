<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

const chartData = ref([])
let priceChart = null

const selectedPeriod = ref('day')
const customFrom = ref('')
const customTo = ref('')

// Формируем диапазон дат
const getPeriodDates = () => {
	const now = new Date()
	let from = new Date()

	switch (selectedPeriod.value) {
		case 'hour':
			from.setMinutes(now.getMinutes() - 60)
			break
		case 'day':
			from.setDate(now.getDate() - 1)
			break
		case 'week':
			from.setDate(now.getDate() - 7)
			break
		case 'month':
			from.setMonth(now.getMonth() - 1)
			break
		case 'year':
			from.setFullYear(now.getFullYear() - 1)
			break
		case 'custom':
			return { from: customFrom.value, to: customTo.value }
	}

	return {
		from: from.toISOString(),
		to: now.toISOString(),
	}
}

// Получаем данные с бэкенда
const fetchPrices = async () => {
	const { from, to } = getPeriodDates()
	const res = await axios.get('http://localhost:3001/prices', {
		params: { from, to },
	})
	chartData.value = res.data
	renderChart()
}

// Рисуем график
const renderChart = () => {
	const ctx = document.getElementById('priceChart').getContext('2d')

	if (priceChart) {
		priceChart.destroy() // Уничтожаем предыдущий график
	}

	priceChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartData.value.map(p => new Date(p.timestamp).toLocaleString()),
			datasets: [
				{
					label: 'Цена закрытия (Close Price)',
					data: chartData.value.map(p => p.close_price),
					borderColor: 'blue',
					fill: false,
					tension: 0.1,
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				x: {
					title: { display: true, text: 'Дата' },
				},
				y: {
					title: { display: true, text: 'Цена (USD)' },
				},
			},
		},
	})
}

// При монтировании компонента загружаем данные
fetchPrices();
</script>

<template>
	<div class="container">
		<h1>Цена Bitcoin (OHLC)</h1>

		<!-- Выбор временного диапазона -->
		<select v-model="selectedPeriod" @change="fetchPrices">
			<option value="hour">За час</option>
			<option value="day">За день</option>
			<option value="week">За неделю</option>
			<option value="month">За месяц</option>
			<option value="year">За год</option>
			<option value="custom">Свой период</option>
		</select>

		<!-- Пользовательский диапазон -->
		<div v-if="selectedPeriod === 'custom'" style="margin-top: 10px">
			<input type="datetime-local" v-model="customFrom" />
			<span> — </span>
			<input type="datetime-local" v-model="customTo" />
			<button @click="fetchPrices">Применить</button>
		</div>

		<!-- График -->
		<canvas id="priceChart" width="800" height="400"></canvas>
	</div>
</template>
