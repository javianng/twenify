<template>
  <Button id="btn" @click="signOut" v-if="user" buttonText="Log Out"></Button>
</template>

<script>
import Button from '@/components/Button.vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export default {
  components: {
    Button
  },
  name: 'LogOut',
  data() {
    return {
      user: false,
      auth: null
    }
  },
  created() {
    this.auth = getAuth()
  },
  mounted() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  },
  methods: {
    async signOut() {
      try {
        await signOut(this.auth)
        this.$router.push({ name: 'Home' })
      } catch (error) {
        console.error('Error signing out: ', error)
      }
    }
  }
}
</script>
