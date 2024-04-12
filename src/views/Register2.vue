<template>
  <PageLayout>
    <div class="px-8 h-full w-full flex justify-between items-center gap-9">
      <div class="flex flex-col gap-8">
        <h1 class="text-7xl font-bold text-tLightPurple">Shhh... Somethings Hatching...</h1>
        <p class="text-3xl text-white">
          Say hello to your <span class="text-tYellow"> QuackPal </span>
          - a feathery friend to follow along with your productive streaks! Get ready to watch it
          grow.
        </p>
        <p class="text-3xl text-white">
          Remember to feed them regularly! <br />
          More time spent working = More QuackCoins to buy food
        </p>
        <div class="flex items-center">
          <p class="text-3xl text-white pr-6 w-fit text-nowrap">Name your QuackPal</p>
          <input
            class="w-full py-5 rounded-lg shadow-md"
            type="text"
            v-model="newPetName"
            placeholder="What should we call your pet?"
          />
        </div>
      </div>
      <div class="flex flex-col items-center min-w-[33%]">
        <img src="/egg.png" alt="" class="h-full w-full" />
        <Button
          @click="changePetName"
          buttonText="It's Grind Time!"
          class="w-[90%] font-semibold rounded-md"
        />
      </div>
    </div>
  </PageLayout>
</template>

<script>
import firebaseApp from '../firebase.js'
import PageLayout from '@/components/PageLayout.vue'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Button from '@/components/Button.vue'

const db = getFirestore(firebaseApp)

export default {
  name: 'Register2',
  components: {
    PageLayout,
    Button
  },
  data() {
    return {
      user: false,
      userData: null,
      newPetName: ''
    }
  },
  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user
        this.useremail = auth.currentUser.email
        await this.fetchData(this.useremail)
      }
    })
  },

  methods: {
    async changePetName() {
      const docRef = doc(db, 'Users', this.useremail)
      await updateDoc(docRef, {
        PetName: this.newPetName
      })
      this.$router.push('/dashboard')
    }
  }
}
</script>
