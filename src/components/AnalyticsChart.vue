<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'
import moment from 'moment'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale)

export default {
  name: 'AnalyticsChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.createChart()
        }
      }
    }
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('myChart').getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.map((item) => moment.unix(item.Date.seconds).format('MMM D, h:mm a')),
          datasets: [
            {
              label: 'Focused Minute',
              data: this.data.map((item) => item.FocusedMinute),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true, // Add this line
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            }
          }
        }
      })
    }
  }
}
</script>
