<template>
  <div class="flex items-center gap-2 w-full justify-center">
    <img src="/icons/heart-solid.svg" class="h-9 w-9" alt="" />
    <div class="w-96 h-9 bg-white rounded-lg relative">
      <div
        :style="{ width: healthPercentage + '%' }"
        class="absolute h-9 bg-green-400 rounded-lg"
      />
    </div>
    <p class="text-white font-semibold">{{ healthPercentage.toFixed(0) }}%</p>
  </div>
</template>

<script>
export default {
  props: {
    futureDate: {
      type: Date,
      required: true
    }
  },
  methods: {
    calculateTreshold() {
      return Date.now() + 1000 * 60 * 60 * 24 * 7
    },
    calculateTotal(future, now) {
      return future - now
    }
  },
  computed: {
    healthPercentage() {
      const treshold = this.calculateTreshold()
      const future = new Date(this.futureDate).getTime()
      const now = Date.now()

      if (future > treshold) {
        return 100
      } else if (now > future) {
        return 0
      } else {
        const total = this.calculateTotal(future, now)
        const percentage = (total / (1000 * 60 * 60 * 24 * 7)) * 100
        return Math.max(0, Math.min(100, percentage))
      }
    }
  }
}
</script>
