<template>
  <div className="relative">
    <div className="absolute top-6 left-6">
      <div className="flex items-end">
        <img src="/twenifyLogo.svg" alt="logo" className="h-24" />
        <img src="/twenifyName.svg" alt="twenify" className="h-20" />
      </div>
    </div>
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-gradient-to-b to-tPurple from-tDarkPurple flex items-end justify-center">
        <div className="grid grid-rows-3 w-max h-3/4">
          <div className="flex flex-col gap-2">
            <h2 className="text-6xl font-semibold text-[#9E4AF1]">20,000 Hours</h2>
            <p className="text-2xl font-medium text-white">
              of total productive work enabled by <br />
              <span className="text-tYellow">twenify</span>
              for users all across the globle
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-6xl font-semibold text-[#9E4AF1]">57 Active Users</h2>
            <p className="text-2xl font-medium text-white">
              trust <span className="text-tYellow">twenify</span> in making their day to day <br />
              productive hours distraction-free
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-4xl font-medium text-white">
              “Twenify has helped me <span className="text-[#9E4AF1]">steer away</span> <br />
              <span className="text-[#9E4AF1]">from distractions</span>, allowing me to focus <br />
              on my work every single day!”
            </h3>
            <p className="text-2xl text-white">- Anders Ooi, Student at NUS</p>
          </div>
        </div>
      </div>

      <div className="bg-tBeige flex items-center justify-center">
        <div className="flex flex-col items-center w-1/2">
          <h1 className=" text-4xl pb-9"><span className="text-[#9E4AF1]">Sign</span> Up</h1>
          <button
            className="flex bg-white w-full py-2 shadow-sm rounded-lg items-center justify-center gap-2"
            @click="signInWithGoogle"
          >
            <img src="/google.png" alt="" className="w-5 h-5" />
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
          <p>Already have an account? <a href="" className="text-[#9E4AF1]"> Log in </a></p>
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
