<template>
  <div class="relative overflow-hidden">
    <div class="absolute top-6 left-6">
      <div class="flex items-end">
        <img src="/twenifyLogo.svg" alt="logo" class="h-24" />
        <img src="/twenifyName.svg" alt="twenify" class="h-20" />
      </div>
    </div>
    <div class="absolute w-[56%] h-full right-0">
      <div class="absolute h-[200vh] w-[200vh] -top-[50vh] bg-tBeige rounded-full z-10" />
    </div>
    <div class="grid grid-cols-2 h-screen bg-gradient-to-b to-tPurple from-tDarkPurple">
      <div class="flex items-end justify-center">
        <div class="grid grid-rows-3 w-max h-3/4">
          <div class="flex flex-col gap-2">
            <h2 class="text-6xl font-semibold text-[#9E4AF1]">20,000 Hours</h2>
            <p class="text-2xl font-medium text-white">
              of total productive work enabled by <br />
              <span class="text-tYellow">twenify</span>
              for users all across the globle
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h2 class="text-6xl font-semibold text-[#9E4AF1]">57 Active Users</h2>
            <p class="text-2xl font-medium text-white">
              trust <span class="text-tYellow">twenify</span> in making their day to day <br />
              productive hours distraction-free
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <h3 class="text-4xl font-medium text-white">
              “Twenify has helped me <span class="text-[#9E4AF1]">steer away</span> <br />
              <span class="text-[#9E4AF1]">from distractions</span>, allowing me to focus <br />
              on my work every single day!”
            </h3>
            <p class="text-2xl text-white">- Anders Ooi, Student at NUS</p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center w-1/2 z-20">
          <h1 class="text-4xl pb-9"><span class="text-[#9E4AF1]">Sign</span> Up</h1>
          <button
            class="flex bg-white w-full py-2 shadow-sm rounded-lg items-center justify-center gap-2"
            @click="signInWithGoogle"
          >
            <img src="/google.png" alt="" class="w-5 h-5" />
            Sign Up With Google
          </button>

          <p class="bg-white px-2 py-1 my-8 rounded-lg">or</p>

          <p class="w-full text-start">Name</p>
          <input
            type="text"
            placeholder="What should we call you?"
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
          />
          <p class="w-full text-start">Email</p>
          <input
            type="text"
            placeholder="you@domain.com"
            v-model="email"
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
          />
          <p class="w-full text-start">Password</p>
          <input
            type="password"
            placeholder="••••••••"
            v-model="password"
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
          />
          <p class="w-full text-start">Must be at least 8 characters</p>
          <button
            @click="register"
            class="bg-gradient-to-b from-yellow-300 to-purple-700 shadow-md rounded-lg w-full py-4 text-white my-5"
          >
            Create Account
          </button>
          <p>Already have an account? <a href="" class="text-[#9E4AF1]"> Log in </a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const register = () => {
  const auth = getAuth()
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Successfully registered!')
      console.log(auth.currentUser)
      router.push('/dashboard')
    })
    .catch((error) => {
      console.log(error.code)
      alert(error.message)
    })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user)
      router.push('/dashboard')
    })
    .catch((error) => {
      // Handle error
    })
}
</script>

<style scoped></style>
