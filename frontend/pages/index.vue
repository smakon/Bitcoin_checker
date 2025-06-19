<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

const chartData = ref([])
const selectedPeriod = ref('day')
const customFrom = ref('')
const customTo = ref('')

const fetchPrices = async () => {
	let url = 'http://localhost:3001/prices'

	if (selectedPeriod.value === 'custom' && customFrom.value && customTo.value) {
		url += `?from=${customFrom.value}&to=${customTo.value}`
	}

	const res = await axios.get(url)
	chartData.value = res.data

	renderChart()
}

const getPeriodDates = period => {
	const now = new Date()
	let from = new Date()

	switch (period) {
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
	}

	return {
		from: from.toISOString(),
		to: now.toISOString(),
	}
}

const renderChart = () => {
	const ctx = document.getElementById('priceChart').getContext('2d')
	new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartData.value.map(p => new Date(p.timestamp).toLocaleString()),
			datasets: [
				{
					label: 'Цена Bitcoin (USD)',
					data: chartData.value.map(p => p.price),
					borderColor: 'blue',
					fill: false,
				},
			],
		},
	})
}

onMounted(() => {
   fetchPrices()
}); 

</script>

<template>Hello</template>

<style scoped lang="scss"></style>
