<template>
  <div className="flex items-end">
    <img src="/twenifyLogo.svg" alt="logo" className="h-24 bg-slate-300" />
    <img src="/twenifyName.svg" alt="twenify" className="h-20 bg-slate-300" />
  </div>
  <div className="grid grid-cols-2 h-screen">
    <div className="  bg-gradient-to-b to-tPurple from-tDarkPurple">
      <h2>20,000 Hours</h2>
      <p>of total productive work enabled by twenify for users all across the globle</p>
      <h2>57 Active Users</h2>
      <p>trust twenify in making their day to day productive hours distraction-free</p>
      <h3>
        “Twenify has helped me steer away from distractions, allowing me to focus on my work every
        single day!”
      </h3>
      <p>- Anders Ooi, Student at NUS</p>
    </div>

    <div className="bg-tBeige flex items-center justify-center">
      <div className="flex flex-col items-center w-1/2">
        <h1><span className="text-tPurple">Sign</span> Up</h1>
        <button className="bg-white w-full py-2 shadow-sm rounded-lg" @click="signInWithGoogle">
          Sign Up With Google
        </button>

        <p className="bg-white px-2 py-1 my-8 rounded-lg">or</p>

        <p className="w-full text-start">Name</p>
        <input
          type="text"
          placeholder="What should we call you?"
          className="w-full py-2 shadow-sm rounded-lg border-0 my-2"
        />
        <p className="w-full text-start">Email</p>
        <input
          type="text"
          placeholder="you@domain.com"
          v-model="email"
          className="w-full py-2 shadow-sm rounded-lg border-0 my-2"
        />
        <p className="w-full text-start">Password</p>
        <input
          type="password"
          placeholder="••••••••"
          v-model="password"
          className="w-full py-2 shadow-sm rounded-lg border-0 my-2"
        />
        <p className="w-full text-start">Must be at least 8 characters</p>
        <button
          @click="register"
          className="bg-gradient-to-b from-yellow-300 to-purple-700 shadow-md rounded-lg w-full py-4 text-white my-5"
        >
          Create Account
        </button>
        <p>Already have an account? <a href="" className="text-tPurple"> Log in </a></p>
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
