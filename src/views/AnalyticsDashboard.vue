<template>
  <Layout>
    <div class="grid grid-cols-2 gap-10 p-8 text-center">
      <div class="items-center flex flex-col justify-end">
        <h1 class="text-[#9E4AF1] text-6xl font-bold">Performance Analytics</h1>
        <p class="text-white">Keep track of how productive you have been through the weeks</p>
      </div>
      <div class="items-center flex flex-col justify-end">
        <h1 class="text-[#9E4AF1] text-6xl font-bold">Leaderboard</h1>
        <p class="text-white">based on total productive hours on twenify this week</p>
      </div>

      <!-- Analytics -->

      <div class="grid grid-cols-2 grid-rows-2 w-full gap-3">
        <div class="bg-white rounded-lg h-[30vh]">1</div>
        <div class="bg-white rounded-lg h-[30vh]">2</div>
        <div class="bg-white rounded-lg h-[30vh]">3</div>
        <div class="bg-white rounded-lg h-[30vh]">4</div>
      </div>

      <!-- Leaderboard -->

      <div class="flex items-start justify-center">
        <div v-if="leaderboardData" class="flex flex-col gap-2 w-[80%]">
          <div
            v-for="(data, index) in leaderboardData"
            :key="index"
            class="bg-[#5B00B3] text-white p-3 w-full rounded-md"
          >
            <div class="flex px-3">
              <div class="flex w-[20%] text-start font-bold">{{ index + 1 }}</div>
              <div class="flex w-[60%] text-start font-bold">{{ data.Name }}</div>
              <div class="flex w-[20%] justify-end font-bold">
                {{ Math.round(data.TotalHours) }} Hours
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-white">Loading leaderboard data...</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import firebaseApp from '../firebase.js'
import Layout from '../components/PageLayout.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
  name: 'AnalyticsDashboard',

  components: {
    Layout
  },

  data() {
    return {
      user: false,
      leaderboardData: null
    }
  },

  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        await this.fetchData()
      }
    })
  },

  methods: {
    async fetchData() {
      const querySnapshot = await getDocs(collection(db, 'Leaderboard'))
      this.leaderboardData = querySnapshot.docs.map((doc) => doc.data())
    }
  }
}
</script>
