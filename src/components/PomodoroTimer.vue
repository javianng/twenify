<template>
  <div
    class="bg-opacity-30 bg-neutral-800 flex flex-col items-center justify-center py-8 min-h-[50vh]"
  >
    <!-- Coin Message Box -->

    <div
      v-if="coinMessage"
      class="absolute bg-neutral-800 top-[10rem] right-0 rounded-l-full py-4 pl-9 pr-8"
    >
      <div class="flex items-center justify-center gap-2">
        <img src="/icons/coins.svg" alt="" class="w-4 h-4" />
        <p class="text-white font-semibold">
          Congratulations! You earned {{ coinMessage }} QuackCoins
        </p>
      </div>
    </div>

    <!-- Pomodoro Toggle -->

    <div class="relative">
      <div class="flex gap-4">
        <button
          @click="manualToggleSession('pomo')"
          :disabled="isRunning || selectedSession === 'pomo'"
          :class="{ underline: selectedSession === 'pomo' }"
          class="px-4 py-2 text-white underline-offset-4"
        >
          Pomodoro
        </button>
        <button
          @click="manualToggleSession('short')"
          :disabled="isRunning || selectedSession === 'short'"
          :class="{ underline: selectedSession === 'short' }"
          class="px-4 py-2 text-white underline-offset-4"
        >
          Short Break
        </button>
        <button
          @click="manualToggleSession('long')"
          :disabled="isRunning || selectedSession === 'long'"
          :class="{ underline: selectedSession === 'long' }"
          class="px-4 py-2 text-white underline-offset-4"
        >
          Long Break
        </button>
        <button @click="toggleSettings" class="px-4 py-2 text-white rounded-md">
          <img src="/icons/gear-solid.svg" alt="" class="w-4 gear-icon cursor-pointer" />
        </button>
      </div>

      <!-- Setting Dashboard -->

      <div
        v-if="showSettings"
        class="bg-tPurple p-4 rounded-lg shadow-xl absolute top-0 -right-[25em]"
      >
        <div class="grid grid-cols-3 grid-rows-2 gap-2 mb-4 -mt-6">
          <label class="text-white w-28 font-semibold flex justify-center items-end"
            >Pomodoro</label
          >
          <label class="text-white w-28 font-semibold flex justify-center items-end"
            >Short Break</label
          >
          <label class="text-white w-28 font-semibold flex justify-center items-end"
            >Long Break</label
          >
          <input
            type="number"
            v-model="sessions.pomo"
            @change="updateSession('pomo')"
            :disabled="isRunning"
            class="flex w-28 rounded-lg"
          />
          <input
            type="number"
            v-model="sessions.short"
            @change="updateSession('short')"
            :disabled="isRunning"
            class="flex w-28 rounded-lg"
          />
          <input
            type="number"
            v-model="sessions.long"
            @change="updateSession('long')"
            :disabled="isRunning"
            class="flex w-28 rounded-lg"
          />
        </div>
        <div class="flex justify-between">
          <button @click="saveSettings" class="px-4 py-2 bg-tYellow text-white rounded-md mr-2">
            Save
          </button>
          <button @click="cancelSettings" class="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Pomodoro Functional -->

    <div class="grid grid-cols-2">
      <img :src="pomodoroImage" alt="" class="h-32" />
      <div class="flex flex-col -ml-28 items-center">
        <div class="text-7xl font-bold mb-4 text-white">{{ formatTime }}</div>
        <Button @click="toggleTimer" :buttonText="isRunning ? 'Stop' : 'Start'"></Button>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import Button from '../components/Button.vue'
import { doc, getFirestore, updateDoc, addDoc, collection, increment } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const TIMER_STORAGE_KEY = 'pomodoro_timer_data'

export default {
  props: {
    userData: {
      type: Object,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      // Other data properties...
      // Load data from local storage or use default values if not available
      sessions: JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY)) || {
        pomo: this.userData.PomoTime,
        short: this.userData.ShortTime,
        long: this.userData.LongTime
      },
      selectedSession: 'pomo',
      timeLeft:
        JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY))?.timeLeft ||
        this.userData.PomoTime * 60,
      isRunning: JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY))?.isRunning || false,
      intervalId: null,
      coinMessage: null,
      showSettings: false,
      completedPomodoros:
        JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY))?.completedPomodoros || 0
    }
  },

  components: {
    Button
  },

  computed: {
    formatTime() {
      let minutes = Math.floor(this.timeLeft / 60)
      let seconds = this.timeLeft % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    pomodoroImage() {
      if (this.completedPomodoros === 1) {
        return '/duckfeet/1feet.png'
      } else if (this.completedPomodoros === 2) {
        return '/duckfeet/2feet.png'
      } else if (this.completedPomodoros === 3) {
        return '/duckfeet/3feet.png'
      } else if (this.completedPomodoros === 4) {
        return '/duckfeet/allfeet.png'
      } else {
        return '/duckfeet/nofeet.png'
      }
    }
  },

  methods: {
    startTimer() {
      if (!this.isRunning) {
        this.timeLeft = this.sessions[this.selectedSession] * 60
        this.intervalId = setInterval(() => {
          this.timeLeft--
          if (this.timeLeft <= 0) {
            clearInterval(this.intervalId)
            this.isRunning = false
            if (this.selectedSession === 'pomo') {
              var audio = new Audio('/quack.mp3')
              audio.play()
              this.completedPomodoros++
              this.incrementCoin()
              this.incrementTotalHours()
              this.incrementLeaderboard()
              this.addToDateFocusedCollection()
              if (this.completedPomodoros == 4) {
                this.toggleSession('long')
              } else {
                this.toggleSession('short')
              }
            } else {
              this.toggleSession('pomo')
              if (this.completedPomodoros == 4) {
                this.completedPomodoros = 0
              }
            }
          }
          this.saveTimerStateToLocalStorage()
        }, 1000)
        this.isRunning = true
      }
    },

    pauseTimer() {
      clearInterval(this.intervalId)
      this.isRunning = false
      this.saveTimerStateToLocalStorage()
    },

    saveTimerStateToLocalStorage() {
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          sessions: this.sessions,
          selectedSession: this.selectedSession,
          timeLeft: this.timeLeft,
          isRunning: this.isRunning,
          completedPomodoros: this.completedPomodoros
        })
      )
    },

    toggleTimer() {
      if (!this.isRunning) {
        this.startTimer()
      } else {
        this.pauseTimer()
      }
    },

    updateSession(sessionType) {
      if (this.sessions[sessionType] <= 0 || isNaN(this.sessions[sessionType])) {
        this.sessions[sessionType] = 1
      }
    },

    // database functions

    incrementLeaderboard() {
      const docRef = doc(db, 'Leaderboard', this.userEmail)
      updateDoc(docRef, { TotalHours: increment(this.sessions.pomo / 60) })
        .then(() => {
          console.log('Leaderboard incremented successfully!')
        })
        .catch((error) => {
          console.error('Error adding Coins: ', error)
        })
    },

    incrementTotalHours() {
      const docRef = doc(db, 'Total Hours', this.userEmail)
      updateDoc(docRef, { TotalHours: increment(this.sessions.pomo / 60) })
        .then(() => {
          console.log('Total Hours incremented successfully!')
        })
        .catch((error) => {
          console.error('Error adding Coins: ', error)
        })
    },

    addToDateFocusedCollection() {
      const currentDate = new Date()
      const duration = this.sessions[this.selectedSession]
      const dateFocused = { Date: currentDate, FocusedMinute: duration }
      const collectionRef = collection(db, 'Users', this.userEmail, 'DateFocused')
      return addDoc(collectionRef, dateFocused)
        .then(() => {
          console.log('Duration added to DateFocused collection successfully!')
        })
        .catch((error) => {
          console.error('Error adding duration to DateFocused collection: ', error)
        })
    },

    incrementCoin() {
      const docRef = doc(db, 'Users', this.userEmail)
      updateDoc(docRef, { Coins: increment(this.sessions.pomo) })
        .then(() => {
          console.log('Coin added successfully!')
          this.coinMessage = `You earned ${this.sessions.pomo} coin(s)!` // Set message

          // Clear the message after 3 seconds
          setTimeout(() => {
            this.coinMessage = null
          }, 3000)
        })
        .catch((error) => {
          console.error('Error adding Coins: ', error)
          this.coinMessage = null // Clear message on error
        })
    },

    // Setting

    toggleSettings() {
      this.showSettings = !this.showSettings
      const gearIcon = document.querySelector('.gear-icon')
      gearIcon.classList.toggle('rotate')
    },

    saveSettings() {
      const docRef = doc(db, 'Users', this.userEmail)
      return updateDoc(docRef, {
        PomoTime: this.sessions.pomo,
        ShortTime: this.sessions.short,
        LongTime: this.sessions.long
      })
        .then(() => {
          console.log('Document successfully updated!')
          this.showSettings = false
          this.timeLeft = this.sessions[this.selectedSession] * 60
        })
        .catch((error) => {
          console.error('Error updating document: ', error)
        })
    },

    cancelSettings() {
      this.showSettings = false
    },

    toggleSession(sessionType) {
      if (this.selectedSession === sessionType && this.isRunning) {
        this.isRunning = false
        this.timeLeft = this.sessions[sessionType] * 60
      } else {
        this.isRunning = false
        this.selectedSession = sessionType
        this.timeLeft = this.sessions[sessionType] * 60
      }
    },

    manualToggleSession(sessionType) {
      if (this.selectedSession === sessionType && this.isRunning) {
        this.isRunning = false
        this.completedPomodoros = 0
        this.timeLeft = this.sessions[sessionType] * 60
      } else {
        this.isRunning = false
        this.completedPomodoros = 0
        this.selectedSession = sessionType
        this.timeLeft = this.sessions[sessionType] * 60
      }
    }
  },

  created() {
    // When the component is created, check if there's any stored data in the local storage
    const storedData = JSON.parse(localStorage.getItem(TIMER_STORAGE_KEY))
    if (storedData) {
      // If there's stored data, load it and set the component's state accordingly
      this.sessions = storedData.sessions
      this.selectedSession = storedData.selectedSession
      this.timeLeft = storedData.timeLeft
      this.isRunning = storedData.isRunning
      this.completedPomodoros = storedData.completedPomodoros
    }
  }
}
</script>

<style>
.rotate {
  transform: rotate(90deg);
  transition: transform 0.3s ease-in-out;
}
</style>
