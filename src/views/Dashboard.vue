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
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  components: {
    Layout,
    PomodoroTimer
  },
  data() {
    return {
      user: false
    }
  },
  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  }
}
</script>
