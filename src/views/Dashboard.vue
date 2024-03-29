<template>
  <Layout>
    <PomodoroTimer v-if="userData && useremail" :user-data="userData" :user-email="useremail" />
    <section class="container mx-auto p-4">
      <!-- Home page content goes here -->
    </section>
  </Layout>
</template>

<script>
import firebaseApp from '../firebase.js'
import Layout from '../components/PageLayout.vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
  components: {
    Layout,
    PomodoroTimer
  },
  data() {
    return {
      user: false,
      useremail: null,
      userData: null
    }
  },
  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = auth.currentUser.email
        await this.fetchData(this.useremail) // Wait for fetchData
      }
    })
  },
  methods: {
    async fetchData(useremail) {
      try {
        const docRef = doc(db, 'Users', useremail)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.userData = docSnap.data()
          console.log(this.userData)
        } else {
          console.log('User not found')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
  }
}
</script>
