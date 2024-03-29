<template>
  <Layout>
    <div class="grid grid-cols-2 gap-10 p-8 text-center">
      <div>
        <h1 class="text-[#9E4AF1] text-6xl font-bold">Performance Analytics</h1>
        <p class="text-white">Keep track of how productive you have been through the weeks</p>
      </div>
      <div>
        <h1 class="text-[#9E4AF1] text-6xl font-bold">Leaderboard</h1>
        <p class="text-white">based on total productive hours on twenify this week</p>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/PageLayout.vue'

export default {
  name: 'AnalyticsDashboard',

  components: {
    Layout
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
