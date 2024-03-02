<template>
  <div className="w-full flex justify-center pt-12">
    <div
      className="grid grid-cols-4 h-fit w-fit gap-8 text-center bg-tBeige p-5 rounded-lg shadow-md"
      id="nav"
    >
      <router-link to="/"><p>Home</p></router-link>
      <router-link to="/dashboard"><p>Dashboard</p></router-link>
      <router-link to="/sign-in"><p>Sign-In</p></router-link>
      <router-link to="/register"><p>Register</p></router-link>
      <button @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
    </div>
  </div>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const isLoggedIn = ref(false)

import { useRouter } from 'vue-router'

const router = useRouter()

let auth

onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/')
  })
}
</script>

<style></style>
