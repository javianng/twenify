<template>
  <div class="bg-gradient-to-b to-tPurple from-tDarkPurple h-full min-h-screen flex flex-col">
    <div class="flex px-8 h-24">
      <div class="flex items-center">
        <div class="flex items-end">
          <router-link to="/">
            <img src="/twenifyLogoName.png" alt="logo" class="h-16" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-8 pt-12" v-if="user">
      <h1 class="text-center text-5xl font-medium text-white">User Setting</h1>
      <div class="flex flex-col items-center">
        <div
          class="w-[20vh] bg-[#5B00B3] rounded-full border-8 border-tYellow overflow-hidden p-8 my-3"
        >
          <img src="/bird.svg" alt="" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <input
            type="text"
            v-model="newUsername"
            :placeholder="user.displayName"
            class="rounded-lg p-2"
          />
          <button @click="changeUsername">
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center gap-4">
          <input
            type="password"
            v-model="newPassword"
            placeholder="New Password"
            class="rounded-lg p-2"
          />
          <button @click="changePassword">
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
      </div>
      <LogOutButton />
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import LogOutButton from '@/components/LogOutButton.vue'
import { getAuth, onAuthStateChanged, updatePassword } from 'firebase/auth'
import { doc, getFirestore } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
  name: 'Profile',
  components: {
    LogOutButton
  },
  data() {
    return {
      user: false,
      useremail: null,
      userData: null,
      newPassword: '',
      newUsername: ''
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
    async changePassword() {
      try {
        await updatePassword(this.user, this.newPassword)
        alert('Password updated successfully!')
      } catch (error) {
        console.error(error)
        alert(error.message)
      }
    },

    async changeUsername() {
      const docRef = doc(db, 'Users', this.userEmail)
      updateDoc(docRef, {
        Name: this.newUsername
      })
      console.log('Document successfully updated!')
    }
  }
}
</script>
