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
  computed: {
    healthPercentage() {
      const treshold = new Date().getTime() + 1000 * 60 * 60 * 24 * 7 // 7 days from now
      const future = new Date(this.futureDate)
      const now = new Date()
      if (future > treshold) {
        return 100
      } else if (now > future) {
        return 0
      } else {
        const total = future - now
        const percentage = (total / (1000 * 60 * 60 * 24 * 7)) * 100
        return Math.max(0, Math.min(100, percentage))
      }
    }
  }
}
</script>
