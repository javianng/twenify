<template>
  <div class="relative overflow-hidden">
    <div class="absolute top-6 left-6">
      <router-link to="/">
        <img src="/twenifyLogoName.png" alt="logo" class="h-24" />
      </router-link>
    </div>
    <div class="absolute w-[56%] h-full right-0">
      <div class="absolute h-[200vh] w-[200vh] -top-[50vh] bg-tBeige rounded-full z-10" />
    </div>
    <div class="grid grid-cols-2 h-screen bg-gradient-to-b to-tPurple from-tDarkPurple pl-6">
      <div class="flex items-end justify-start">
        <div class="grid grid-rows-3 w-max h-2/3">
          <div class="flex flex-col gap-2">
            <h2 class="text-6xl font-semibold text-tLightPurple">Welcome Back!</h2>
            <p class="text-2xl font-medium text-white">Are you ready to soar to new heights?</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center w-1/2 z-20">
          <h1 class="text-4xl pb-9"><span class="text-tLightPurple">Sign-In</span></h1>
          <button
            class="flex bg-white w-full py-2 shadow-sm rounded-lg items-center justify-center gap-2"
            @click="signInWithGoogle"
          >
            <img src="/icons/google.svg" alt="" class="w-5 h-5" />
            Sign In With Google
          </button>

          <p class="bg-white px-2 py-1 my-8 rounded-lg">or</p>

          <p class="w-full text-start">Email</p>
          <input
            type="text"
            placeholder="you@domain.com"
            v-model="email"
            s
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
          />
          <p class="w-full text-start">Password</p>
          <input
            type="password"
            placeholder="••••••••"
            v-model="password"
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
          />
          <button
            @click="register"
            class="bg-gradient-to-b from-yellow-300 to-purple-700 shadow-md rounded-lg w-full py-4 text-white my-5"
          >
            Sign-In
          </button>
        </div>
      </div>
    </div>

    <p v-if="errMsg">{{ errMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errMsg = ref()
const router = useRouter()

const register = () => {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Successfully signed in!')
      console.log(auth.currentUser)
      router.push('/dashboard')
    })
    .catch((error) => {
      console.log(error.code)
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email'
          break
        case 'auth/user-not-found':
          errMsg.value = 'No account with that email was found'
          break
        case 'auth/wrong-password':
          errMsg.value = 'Incorrect password'
          break
        default:
          errMsg.value = 'Email or password was incorrect'
          break
      }
      alert(errMsg.value)
    })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then(() => {
      router.push('/dashboard')
    })
    .catch((error) => {
      const errorMessage = error.message
      console.alert(errorMessage)
    })

}
</script>
