<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/sign-in">Sign-In</router-link>
    <router-link to="/register">Register</router-link>
    <button @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
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
