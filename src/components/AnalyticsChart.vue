<template>
  <div>
    <canvas id="myChart" style="width: 180%; height: 600px;"></canvas> <!-- Adjust width and height as needed -->
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import moment from 'moment';

Chart.register(BarController, CategoryScale, LinearScale, BarElement);

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
          this.createChart();
        }
      }
    }
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('myChart').getContext('2d');
      const today = moment(); // Get today's date
      const pastSevenDays = []; // Array to hold past 7 days
      for (let i = 0; i < 7; i++) {
        pastSevenDays.push(today.clone().subtract(i, 'days').format('DD/MM/YY')); // Add formatted dates to array
      }
      
      new Chart(ctx, {
        type: 'bar', // Set chart type to 'bar'
        data: {
          labels: pastSevenDays.reverse(), // Reverse array to display in chronological order
          datasets: [{
            label: 'Focused Minute',
            data: this.data.map(item => item.FocusedMinute),
            backgroundColor: 'rgb(75, 192, 192)' // Set bar color
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true, // Stack bars on the x-axis if needed
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            },
            y: {
              beginAtZero: true // Start y-axis from zero
            }
          }
        }
      });
    }
  }
};
</script>
