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
};


</script>

<template></template>

<style scoped lang="scss"></style>
