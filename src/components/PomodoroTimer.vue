<template>
  <div
    class="bg-opacity-30 bg-neutral-800 flex flex-col items-center justify-center py-8 mt-4 min-h-[50vh]"
  >
    <div class="relative">
      <div class="flex gap-4">
        <button
          @click="toggleSession('pomo')"
          :disabled="isRunning || selectedSession === 'pomo'"
          class="px-4 py-2 text-white"
        >
          Work Session
        </button>
        <button
          @click="toggleSession('short')"
          :disabled="isRunning || selectedSession === 'short'"
          class="px-4 py-2 text-white"
        >
          Short Break
        </button>
        <button
          @click="toggleSession('long')"
          :disabled="isRunning || selectedSession === 'long'"
          class="px-4 py-2 text-white"
        >
          Long Break
        </button>
        <button @click="toggleSettings" class="px-4 py-2 text-white rounded-md">
          <img src="/icons/gear-solid.svg" alt="" class="w-4" />
        </button>
      </div>
      <div
        v-if="showSettings"
        class="bg-white p-4 border rounded-md shadow-md absolute top-0 -right-[18em]"
      >
        <label class="block mb-2">Work Duration (minutes):</label>
        <input
          type="number"
          v-model="sessions.pomo"
          @change="updateSession('pomo')"
          :disabled="isRunning"
          class="block w-full mb-4 border rounded-md p-2"
        />
        <label class="block mb-2">Short Break Duration (minutes):</label>
        <input
          type="number"
          v-model="sessions.short"
          @change="updateSession('short')"
          :disabled="isRunning"
          class="block w-full mb-4 border rounded-md p-2"
        />
        <label class="block mb-2">Long Break Duration (minutes):</label>
        <input
          type="number"
          v-model="sessions.long"
          @change="updateSession('long')"
          :disabled="isRunning"
          class="block w-full mb-4 border rounded-md p-2"
        />
        <div class="flex justify-between">
          <button @click="saveSettings" class="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">
            Save
          </button>
          <button @click="cancelSettings" class="px-4 py-2 bg-gray-400 text-white rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div class="flex">
      <img src="/fourFeet.png" alt="" class="h-32" />
      <div class="flex flex-col">
        <div class="text-7xl font-bold mb-4 text-white">{{ formatTime }}</div>
        <Button @click="toggleTimer" :buttonText="isRunning ? 'Stop' : 'Start'"></Button>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import Button from '../components/Button.vue'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'

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
      showSettings: false
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
      if (!this.isRunning) {
        this.timeLeft = this.sessions[this.selectedSession] * 60
        this.intervalId = setInterval(() => {
          this.timeLeft--
          if (this.timeLeft <= 0) {
            clearInterval(this.intervalId)
          }
        }, 1000)
        this.isRunning = true
      }
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
    }
  }
}
</script>
