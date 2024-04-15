<template>
  <PageLayout>
    <div class="grid grid-cols-2 gap-10 p-8 text-center">
      <div class="items-center flex flex-col justify-end">
        <h1 class="text-tLightPurple text-6xl font-bold">Performance Analytics</h1>
        <p class="text-white">Keep track of how productive you have been through the weeks</p>
      </div>

      <div class="items-center flex flex-col justify-end">
        <h1 class="text-tLightPurple text-6xl font-bold">Leaderboard</h1>
        <p class="text-white">based on total productive hours on twenify this week</p>
      </div>

      <!-- Analytics -->

      <div class="grid grid-cols-2 grid-rows-2 w-full gap-3">
        <div class="bg-white rounded-lg h-[30vh] flex flex-col p-4">
          <p class="text-start font-semibold">Performance History</p>
          <div class="flex justify-center h-full items-center">
            <AnalyticsChart :data="subcollectionDateFocused"></AnalyticsChart>
          </div>
        </div>
        <div class="bg-white rounded-lg h-[30vh] flex flex-col p-4">
          <p class="text-start font-semibold">Total Hours spent on twenify</p>
          <p class="text-[6rem] font-bold text-tYellow flex h-full justify-center items-center">
            {{ Math.floor(totalHoursSpent) }}
          </p>
        </div>
        <div class="bg-white rounded-lg h-[30vh] flex flex-col p-4">
          <p class="text-start font-semibold">Longest Pomodoro Streak in hours</p>
        </div>
        <div class="bg-white rounded-lg h-[30vh] flex flex-col p-4">
          <p class="text-start font-semibold">Global Ranking</p>
          <p
            class="text-[6rem] font-bold text-tLightPurple flex h-full justify-center items-center"
          >
            {{ userPosition + 1 }}st
          </p>
        </div>
      </div>

      <!-- Leaderboard -->

      <div class="flex items-start justify-center">
        <div v-if="leaderboardData" class="flex flex-col gap-2 w-[80%]">
          <div
            v-for="(data, index) in leaderboardData"
            :key="index"
            :class="{
              'bg-tPurple text-tYellow p-3 w-full rounded-md': data.Email === useremail,
              'bg-tPurple text-white p-3 w-full rounded-md': data.Email !== useremail
            }"
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
  </PageLayout>
</template>

<script>
import firebaseApp from '../firebase.js'
import PageLayout from '@/components/PageLayout.vue'
import AnalyticsChart from '../components/AnalyticsChart.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  doc,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
  name: 'AnalyticsDashboard',

  components: {
    PageLayout,
    AnalyticsChart
  },

  data() {
    return {
      user: false,
      useremail: null,
      userPosition: null,
      totalHoursSpent: null,
      leaderboardData: null,
      subcollectionDateFocused: null
    }
  },

  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = auth.currentUser.email
        await this.fetchLeaderboard()
        await this.fetchTotalHours()
        await this.fetchDateFocused(this.useremail)
      }
    })
  },

  methods: {
    async fetchLeaderboard() {
      const querySnapshot = await getDocs(
        query(collection(db, 'Leaderboard'), orderBy('TotalHours', 'desc'), limit(10))
      )
      const leaderboardData = querySnapshot.docs.map((doc) => doc.data())
      const userPosition = leaderboardData.findIndex((data) => data.Email === this.useremail)
      this.leaderboardData = leaderboardData
      this.userPosition = userPosition
    },

    async fetchTotalHours() {
      const docRef = doc(db, 'Total Hours', this.useremail)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.totalHoursSpent = docSnap.data().TotalHours
        console.log(this.totalHoursSpent)
      } else {
        console.log('User not found')
      }
    },

    async fetchDateFocused(useremail) {
      try {
        const userDocRef = doc(db, 'Users', useremail)
        const subcollectionRef = collection(userDocRef, 'DateFocused')
        const subcollectionSnapshot = await getDocs(subcollectionRef)
        this.subcollectionDateFocused = subcollectionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(this.subcollectionDateFocused)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
  }
}
</script>
