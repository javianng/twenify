<template>
  <Layout>
    <PomodoroTimer />
    <section class="container mx-auto p-4">
      <!-- Home page content goes here -->
    </section>
  </Layout>
</template>

<script>
import Layout from '../components/PageLayout.vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'

export default {
  components: {
    Layout,
    PomodoroTimer
  }
}
</script>
