<template>
  <div class="relative overflow-hidden">
    <div class="absolute top-6 left-6">
      <router-link to="/">
        <div class="flex items-end">
          <img src="/twenifyLogo.svg" alt="logo" class="h-24" />
          <img src="/twenifyName.svg" alt="twenify" class="h-20" />
        </div>
      </router-link>
    </div>
    <div class="absolute w-[56%] h-full right-0">
      <div class="absolute h-[200vh] w-[200vh] -top-[50vh] bg-tBeige rounded-full z-10" />
    </div>
    <div class="grid grid-cols-2 h-screen bg-gradient-to-b to-tPurple from-tDarkPurple pl-6">
      <div class="flex items-end justify-center max-w-[85%]">
        <div class="grid grid-rows-3 w-max h-3/4">
          <div class="flex flex-col gap-2">
            <h2 class="text-6xl font-semibold text-[#9E4AF1]">20,000 Hours</h2>
            <p class="text-2xl font-medium text-white">
              of total productive work enabled by
              <span class="text-tYellow">twenify</span>
              for users all across the globle
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h2 class="text-6xl font-semibold text-[#9E4AF1]">57 Active Users</h2>
            <p class="text-2xl font-medium text-white">
              trust <span class="text-tYellow">twenify</span> in making their day to day productive
              hours distraction-free
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <h3 class="text-4xl font-medium text-white">
              “Twenify has helped me <span class="text-[#9E4AF1]">steer away</span>
              <span class="text-[#9E4AF1]">from distractions</span>, allowing me to focus on my work
              every single day!”
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
            <img src="/icons/google.svg" alt="" class="w-5 h-5" />
            Sign Up With Google
          </button>

          <p class="bg-white px-2 py-1 my-8 rounded-lg">or</p>

          <p class="w-full text-start">Name</p>
          <input
            type="text"
            placeholder="What should we call you?"
            class="w-full py-2 shadow-sm rounded-lg border-0 my-2"
            v-model="name"
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
          <div class="py-3">
            <Button @click="register" buttonText="Create Account" />
          </div>
          <p>
            Already have an account?
            <router-link to="/sign-in">
              <span class="text-[#9E4AF1]"> Log in </span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const name = ref('')
const router = useRouter()

const auth = getAuth()
const db = getFirestore()

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const userId = userCredential.user.email

    const currentDate = Timestamp.fromDate(new Date())

    await setDoc(doc(db, 'Users', userId), {
      Name: name.value,
      Coins: 0,
      LongTime: 10,
      ShortTime: 5,
      PomoTime: 25,
      PetSkins: ['Pig'],
      PetAccessories: ['Sunglasses'],
      ActivePetSkin: 'Pig',
      ActivePetAccessory: 'Sunglasses',
      PetHealth: currentDate,
      BlockedWebsite: ['testwebsite.com']
    })

    await setDoc(doc(db, 'Leaderboard', userId), {
      Name: name.value,
      FocusStreak: 0
    })

    const DateFocused = { Date: currentDate, FocusedMinute: 10 }
    const Task = { TaskName: 'task name', Deleted: false }

    await addDoc(collection(db, 'Users', userId, 'DateFocused'), DateFocused)
    await addDoc(collection(db, 'Users', userId, 'Tasks'), Task)

    console.log('Successfully registered, added to Firestore!')
    router.push('/dashboard')
  } catch (error) {
    console.error(error.code)
    alert(error.message)
  }
}

const signInWithGoogle = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  try {
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    const userId = user.email
    const { displayName, email } = user
    const currentDate = Timestamp.fromDate(new Date())

    await setDoc(doc(db, 'Users', userId), {
      Name: displayName,
      Coins: 0,
      LongTime: 10,
      ShortTime: 5,
      PomoTime: 25,
      PetSkins: ['Pig'],
      PetAccessories: ['Sunglasses'],
      ActivePetSkin: 'Pig',
      ActivePetAccessory: 'Sunglasses',
      PetHealth: currentDate,
      BlockedWebsite: ['testwebsite.com']
    })

    await setDoc(doc(db, 'Leaderboard', userId), {
      Name: displayName,
      FocusStreak: 0
    })

    const DateFocused = { Date: currentDate, FocusedMinute: 10 }
    const Task = { TaskName: 'task name', Deleted: false }

    await addDoc(collection(db, 'Users', userId, 'DateFocused'), DateFocused)
    await addDoc(collection(db, 'Users', userId, 'Tasks'), Task)

    console.log('Successfully registered, added to Firestore!')
    router.push('/dashboard')
  } catch (error) {
    console.error(error.code)
    alert(error.message)
  }
}
</script>

<style scoped></style>
