<template>
  <Button id="btn" @click="signOut()" v-if="user" buttonText="Log Out"></Button>
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
  },
  methods: {
    signOut() {
      const auth = getAuth()
      const user = auth.currentUser
      signOut(auth, user)
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
