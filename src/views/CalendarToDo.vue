<template>
  <PageLayout>
    <div class="calendar-todo-container flex flex-col md:flex-row">
      <div class="calendar-container flex-1 ml-4">
        <!-- Flex container with vertical centering -->
        <div class="flex items-center mt-4 space-x-4">
          <h1 class="text-5xl font-bold text-tLightPurple">Your Calendar</h1>
          <button
            v-if="!hasCalendarAccess"
            class="bg-red-500 text-white px-4 py-2 mt-2 rounded"
            @click="googleLogin"
          >
            Connect Google Calendar
          </button>
          <button v-else class="bg-red-500 text-white px-4 py-2 mt-2 rounded" @click="signOut">
            Sign Out
          </button>
        </div>
        <div class="calendar-wrapper bg-white p-4 mt-4">
          <FullCalendar ref="calendar" :options="calendarOptions" />
        </div>
      </div>
      <div class="to-do-list-container flex-1 ml-4">
        <h1 class="text-5xl font-bold text-tLightPurple mt-4">Your To-Do List</h1>
        <ul class="list-disc pl-5 text-white mt-4">
          <li>Task 1</li>
          <li>Task 2</li>
          <li>Task 3</li>
          <li>Task 4</li>
          <li>Task 5</li>
        </ul>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import PageLayout from '@/components/PageLayout.vue'
import { getGoogleAuthLink, logInViaProvider, revokeGoogleAccess } from '@/controllers/auth'

const route = useRoute()
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const isFirebaseAuthenticated = ref(false)
const hasCalendarAccess = ref(false)
const calendarEvents = ref([])
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: []
})

const googleLogin = async () => {
  const authLink = await getGoogleAuthLink()
  window.location.replace(authLink)
}

const handleGoogleLoginRedirect = async () => {
  await logInViaProvider(route.query.id_token)
  router.push('/calendarToDo')
}

const fetchCalendarEvents = async (accessToken, email) => {
  try {
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const response = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        params: {
          timeMin: startOfWeek.toISOString(),
          timeMax: endOfWeek.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    calendarEvents.value = response.data.items.map((event) => ({
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      title: event.summary
    }))
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Access token expired, refresh the token
      try {
        const refreshResponse = await axios.post('http://localhost:8000/refresh_token', {
          email: email
        })

        const newAccessToken = refreshResponse.data.access_token
        const userRef = doc(db, 'Users', email)
        await updateDoc(userRef, {
          access_Token: newAccessToken,
          token_expiration: Date.now() + 3600 * 1000
        })

        // Retry fetching the calendar events with the new access token
        await fetchCalendarEvents(newAccessToken, email)
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError)
        // Handle the refresh error, e.g., prompt the user to log in again
      }
    } else {
      console.error('Error fetching calendar events:', error)
      // Handle other errors
    }
  }
}

const signOut = async () => {
  if (isFirebaseAuthenticated.value) {
    const userRef = doc(db, 'Users', auth.currentUser.email)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const { access_Token } = userDoc.data()
      await revokeGoogleAccess(access_Token)
      await updateDoc(userRef, {
        access_Token: null,
        token_expiration: null
      })
    }
    hasCalendarAccess.value = false
    calendarEvents.value = []
  }
}

watch(calendarEvents, (newEvents) => {
  calendarOptions.value.events = newEvents
})

onMounted(() => {
  if (route.query.id_token) {
    handleGoogleLoginRedirect()
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isFirebaseAuthenticated.value = true
      const userRef = doc(db, 'Users', user.email)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const { access_Token } = userDoc.data()
        if (access_Token) {
          hasCalendarAccess.value = true
          await fetchCalendarEvents(access_Token, user.email)
        } else {
          hasCalendarAccess.value = false
        }
      }
    } else {
      isFirebaseAuthenticated.value = false
      hasCalendarAccess.value = false
    }
  })
})
</script>
