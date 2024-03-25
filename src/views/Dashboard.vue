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
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

export default {
  components: {
    Layout,
    PomodoroTimer
  },
  setup() {
    const userData = ref(null) // Reactive property to store user data

    onMounted(async () => {
      const auth = getAuth()
      const db = getFirestore()
      const user = auth.currentUser

      if (user) {
        const userDocRef = doc(db, 'Users', user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          userData.value = userDocSnap.data() // Store the user data
        } else {
          console.log('No such document!')
        }
      }
    })

    return { userData }
  }
}
</script>
