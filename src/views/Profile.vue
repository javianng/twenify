<template>
  <PageLayout>
    <div class="flex flex-col items-center gap-8 pt-12" v-if="user">
      <h1 class="text-center text-5xl font-medium text-white">User Setting</h1>
      <div class="flex flex-col items-center">
        <div
          class="w-[20vh] bg-tLightPurple rounded-full border-8 border-tYellow overflow-hidden p-8 my-3"
        >
          <img src="/bird.svg" alt="" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <p class="font-bold text-white w-20">Username</p>
          <input
            type="text"
            v-model="newUsername"
            :placeholder="usernamePlaceholder"
            class="rounded-lg p-2"
          />
          <button @click="changeUsername" title="Change username">
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center gap-4">
          <p class="font-bold text-white w-20">Password</p>
          <input
            type="password"
            v-model="newPassword"
            placeholder="New Password"
            class="rounded-lg p-2"
          />
          <button @click="changePassword" title="Change password">
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center gap-4 justify-start pt-5">
          <p class="font-bold text-white w-20">Themes</p>
          <div class="grid grid-flow-col gap-3">
            <button
              @click="changeBackgroundStyle('style1')"
              class="bg-[#3C0777] w-8 h-8 border-4 border-white rounded-full"
            ></button>
            <button
              @click="changeBackgroundStyle('style2')"
              class="bg-[#48C6A1] w-8 h-8 border-4 border-white rounded-full"
            ></button>
            <button
              @click="changeBackgroundStyle('style3')"
              class="bg-[#F26745] w-8 h-8 border-4 border-white rounded-full"
            ></button>
          </div>
        </div>
      </div>
      <LogOutButton />
    </div>
  </PageLayout>
</template>

<script>
import firebaseApp from '../firebase.js'
import PageLayout from '@/components/PageLayout.vue'
import LogOutButton from '@/components/LogOutButton.vue'
import { doc, getFirestore, updateDoc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, updatePassword } from 'firebase/auth'

const db = getFirestore(firebaseApp)

export default {
  name: 'Profile',
  components: {
    LogOutButton,
    PageLayout
  },
  computed: {
    usernamePlaceholder() {
      return this.userData && this.userData.Name ? this.userData.Name : 'New Username'
    }
  },
  data() {
    return {
      user: false,
      useremail: null,
      userData: null,
      newPassword: '',
      newUsername: '',
      backgroundStyle: localStorage.getItem('backgroundStyle') || 'default'
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
    changeBackgroundStyle(style) {
      this.backgroundStyle = style
      localStorage.setItem('backgroundStyle', style)
      location.reload()
    },

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
    },

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
      const docRef = doc(db, 'Users', this.useremail)
      const leadRef = doc(db, 'Leaderboard', this.useremail)
      await updateDoc(docRef, {
        Name: this.newUsername
      })
      await updateDoc(leadRef, {
        Name: this.newUsername
      })
      console.log('Document successfully updated!')
    }
  }
}
</script>
