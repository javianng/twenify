<template>
  <PageLayout>
    <div class="calendar-todo-container flex flex-col md:flex-row gap-2 md:gap-0">
      <div class="calendar-container flex-1 mx-4">
        <!-- Calendar section -->
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
        <div class="calendar-wrapper bg-white p-4 mt-4 rounded-lg shadow-md">
          <FullCalendar ref="calendar" :options="calendarOptions" />
        </div>
      </div>
      <!-- To-Do List section -->
      <div class="to-do-list-container flex flex-1 flex-col ml-4 mr-4 mt-4">
        <h1 class="text-5xl font-bold text-tLightPurple">Your To-Do List</h1>
        <div class="flex flex-col bg-white rounded-lg shadow mt-4 p-4 h-full">
          <!-- Task list container -->
          <div class="overflow-y-auto max-h-96">
            <div
              v-for="task in userTasks"
              :key="task.id"
              class="flex items-center justify-between p-2 border-b"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :id="task.id"
                  @change="toggleTaskStatus(task)"
                  :checked="task.Cleared"
                  class="mr-2"
                />
                <label :for="task.id" :class="{ 'line-through': task.Cleared }">{{
                  task.TaskName
                }}</label>
              </div>
              <button
                @click="deleteTask(task.id)"
                class="bg-red-500 text-white px-4 py-2 rounded ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
          <!-- Form submission container -->
          <div class="mt-auto">
            <input
              v-model="newTaskName"
              type="text"
              placeholder="Enter task name"
              class="p-2 border rounded w-full mb-2"
            />
            <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  collection
} from 'firebase/firestore'
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
const userTasks = ref([])
const showAddTask = ref(false)
const newTaskName = ref('')

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
        const refreshResponse = await axios.post(
          'https://twenify-backend.vercel.app/refresh_token',
          {
            email: email
          }
        )

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

      const fetchTasks = async () => {
        const tasksRef = collection(userRef, 'Tasks')
        const tasksSnapshot = await getDocs(tasksRef)
        userTasks.value = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      }

      fetchTasks()
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

const addTask = async () => {
  if (newTaskName.value.trim() !== '') {
    const tasksRef = collection(db, 'Users', auth.currentUser.email, 'Tasks')
    const newTask = await addDoc(tasksRef, {
      TaskName: newTaskName.value,
      Cleared: false
    })
    userTasks.value.push({ id: newTask.id, TaskName: newTaskName.value, Cleared: false })
    newTaskName.value = '' // Clear the input field
    showAddTask.value = false // Hide the add task form
  }
}

const toggleTaskStatus = async (task) => {
  const taskRef = doc(db, 'Users', auth.currentUser.email, 'Tasks', task.id)
  await updateDoc(taskRef, {
    Cleared: !task.Cleared
  })
  // Update the local state to reflect the change
  task.Cleared = !task.Cleared
}

const deleteTask = async (taskId) => {
  const taskRef = doc(db, 'Users', auth.currentUser.email, 'Tasks', taskId)
  await deleteDoc(taskRef)
  // Remove the task from the local state
  userTasks.value = userTasks.value.filter((task) => task.id !== taskId)
}
</script>
