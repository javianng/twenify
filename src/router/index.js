import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import SignIn from '@/views/SignIn.vue'
import BlockedSite from '@/views/BlockedSite.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import AnalyticsDashboard from '@/views/AnalyticsDashboard.vue'
import FriendsPage from '@/views/FriendsPage.vue'
import QuackPalPage from '@/views/QuackPalPage.vue'
import Register2 from '@/views/Register2.vue'

import Spotify from '@/components/widgets/Spotify.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/blockedSite',
    name: 'BlockedSite',
    component: BlockedSite
  },
  {
    path: '/spotify',
    name: 'Spotify',
    component: Spotify
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/quackPalPage',
    name: 'QuackPalPage',
    component: QuackPalPage
  },
  {
    path: '/analyticsDashboard',
    name: 'AnalyticsDashboard',
    component: AnalyticsDashboard
  },
  {
    path: '/register2',
    name: 'Register2',
    component: Register2
  },
  {
    path: '/friendsPage',
    name: 'FriendsPage',
    component: FriendsPage
  }
]

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert("You don't have access!")
      next('/')
    }
  } else {
    next()
  }
})

export default router
