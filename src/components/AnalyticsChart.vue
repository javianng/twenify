<template>
  <div>
    <canvas id="myChart" style="width: 100%; height: 250px;" class="p-4"></canvas>
    <!-- Adjust width and height as needed -->
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
          labels: pastSevenDays.reverse().map(date => moment(date, 'DD/MM/YY').format('DD/MM')), // Updated date format
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
              stacked: true,
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value + ' mins'; // Display mins on y-axis label
                }
              }
            }
          }
        }
      });
    }
  }
};
</script>
