<template>
  <div
    class="bg-opacity-30 bg-neutral-800 flex flex-col items-center justify-center py-8 mt-4 min-h-[50vh]"
  >
    <!-- Pomodoro Toggle -->

    <div class="relative">
      <div class="flex gap-4">
        <button
          @click="manualToggleSession('pomo')"
          :disabled="isRunning || selectedSession === 'pomo'"
          class="px-4 py-2 text-white"
        >
          Pomodoro Duration
        </button>
        <button
          @click="manualToggleSession('short')"
          :disabled="isRunning || selectedSession === 'short'"
          class="px-4 py-2 text-white"
        >
          Short Break
        </button>
        <button
          @click="manualToggleSession('long')"
          :disabled="isRunning || selectedSession === 'long'"
          class="px-4 py-2 text-white"
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
        class="bg-[#4F019B] p-4 rounded-lg shadow-xl absolute top-0 -right-[25em]"
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
          <button @click="saveSettings" class="px-4 py-2 bg-[#FFC54E] text-white rounded-md mr-2">
            Save
          </button>
          <button @click="cancelSettings" class="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Pomodoro Functional -->

    <div class="flex">
      <img :src="pomodoroImage" alt="" class="h-32" />
      <div class="flex flex-col -ml-28">
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
      sessions: {
        pomo: this.userData.PomoTime,
        short: this.userData.ShortTime,
        long: this.userData.LongTime
      },
      selectedSession: 'pomo',
      timeLeft: this.userData.PomoTime * 60,
      isRunning: false,
      intervalId: null,
      showSettings: false,
      completedPomodoros: 0
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
    toggleTimer() {
      if (!this.isRunning) {
        this.startTimer()
      } else {
        this.pauseTimer()
      }
    },

    startTimer() {
      const docRef = doc(db, 'Leaderboard', this.userEmail)
      if (!this.isRunning) {
        this.timeLeft = this.sessions[this.selectedSession] * 60
        this.intervalId = setInterval(() => {
          this.timeLeft--
          if (this.timeLeft <= 0) {
            clearInterval(this.intervalId)
            this.isRunning = false
            if (this.selectedSession === 'pomo') {
              this.completedPomodoros++
              this.addToDateFocusedCollection()
              updateDoc(docRef, { TotalHours: increment(this.sessions.pomo / 60) })
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
        }, 1000)
        this.isRunning = true
      }
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

    pauseTimer() {
      clearInterval(this.intervalId)
      this.isRunning = false
    },

    updateSession(sessionType) {
      if (this.sessions[sessionType] <= 0 || isNaN(this.sessions[sessionType])) {
        this.sessions[sessionType] = 1
      }
    },

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
        this.timeLeft = this.sessions[sessionType] * 60
        this.isRunning = false
      } else {
        this.selectedSession = sessionType
        this.timeLeft = this.sessions[sessionType] * 60
        this.isRunning = false
      }
    },

    manualToggleSession(sessionType) {
      if (this.selectedSession === sessionType && this.isRunning) {
        this.timeLeft = this.sessions[sessionType] * 60
        this.isRunning = false
        this.completedPomodoros = 0
      } else {
        this.selectedSession = sessionType
        this.timeLeft = this.sessions[sessionType] * 60
        this.isRunning = false
        this.completedPomodoros = 0
      }
    }
  }
}
</script>

<style>
.rotate {
  transform: rotate(90deg); /* Adjust the degree of rotation as needed */
}
</style>
