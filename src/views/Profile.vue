<template>
  <PageLayout>
    <div class="flex flex-col items-center gap-8 pt-0" v-if="user">
      <h1 class="text-center text-4xl font-medium text-white">User Setting</h1>
      <div class="flex flex-col items-center">
        <div
          class="w-64 h-64 bg-tLightPurple rounded-full border-8 border-tYellow overflow-hidden p-8 my-3 duration-150 hover:scale-105"
        >
          <img :src="petImageLink" alt="" class="z-50 scale-[2.2] pt-8" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <p class="font-bold text-white w-20">Username</p>
          <input
            type="text"
            v-model="newUsername"
            :placeholder="usernamePlaceholder"
            class="rounded-lg p-1.5"
          />
          <button
            @click="changeUsername"
            title="Change username"
            class="duration-150 hover:scale-125"
          >
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center gap-4">
          <p class="font-bold text-white w-20">Password</p>
          <input
            type="password"
            v-model="newPassword"
            placeholder="New Password"
            class="rounded-lg p-1.5"
          />
          <button
            @click="changePassword"
            title="Change password"
            class="duration-150 hover:scale-125"
          >
            <img src="/icons/pencil.svg" alt="" class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center gap-4 justify-start pt-5">
          <p class="font-bold text-white w-20">Themes</p>
          <div class="grid grid-flow-col gap-3">
            <button
              @click="changeBackgroundStyle('style1')"
              :class="backgroundStyle === 'style1' ? 'border-tYellow' : 'border-white'"
              class="bg-[#3C0777] w-8 h-8 border-4 rounded-full duration-150 hover:scale-110"
            ></button>
            <button
              @click="changeBackgroundStyle('style2')"
              :class="backgroundStyle === 'style2' ? 'border-tYellow' : 'border-white'"
              class="bg-[#48C6A1] w-8 h-8 border-4 rounded-full duration-150 hover:scale-110"
            ></button>
            <button
              @click="changeBackgroundStyle('style3')"
              :class="backgroundStyle === 'style3' ? 'border-tYellow' : 'border-white'"
              class="bg-[#F26745] w-8 h-8 border-4 rounded-full duration-150 hover:scale-110"
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
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
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
      petImageName: null,
      petImageLink: null,
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
        await this.fetchData(this.useremail)
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
      const docRef = doc(db, 'Users', useremail)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        this.userData = docSnap.data()
        this.petImageName = docSnap.data().ActivePetAccessory
        const accessoriesDocRef = doc(db, 'Pet Accessories', this.petImageName)
        const accessoriesDocSnap = await getDoc(accessoriesDocRef)
        if (accessoriesDocSnap.exists()) {
          this.petImageLink = accessoriesDocSnap.data().Duck1
        }
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
