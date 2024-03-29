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
    <div style="text-align: center" v-if="user">
      <h1 class="text-5xl font-medium text-white">User Setting</h1>
      <div>
        <p class="text-white">
          Name: {{ user.displayName }} <br />
          Email: {{ user.email }} <br />
        </p>
      </div>
      <LogOutButton />
    </div>
  </div>
</template>

<script>
import LogOutButton from '@/components/LogOutButton.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'Profile',
  components: {
    LogOutButton
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
