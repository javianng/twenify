<template>
  <Background :style="backgroundStyle">
    <div class="flex justify-between px-8 h-24">
      <div
        @click="toggleDropdown"
        class="bg-neutral-800 h-24 w-24 flex items-center justify-center group cursor-pointer"
      >
        <img
          src="/twenifyLogo.png"
          alt="logo"
          class="h-16 w-16 items-center group-hover:scale-105 duration-150"
        />
      </div>
      <div class="flex items-center">
        <router-link to="/">
          <img src="/twenifyLogoName.png" alt="logo" class="h-16" />
        </router-link>
      </div>
    </div>

    <!-- Dropdown Content -->
    <div v-if="isDropdownVisible" class="relative z-10">
      <div class="absolute">
        <nav
          id="navbar"
          class="bg-neutral-800 w-24 hover:w-52 group relative mx-8 shadow-lg rounded-b-xl h-fit pb-4 overflow-scroll items-center justify-start flex flex-col gap-4 pt-4"
        >
          <router-link
            to="/dashboard"
            class="flex items-center gap-6 group/edit hover:scale-105 duration-150"
          >
            <img src="/icons/clock-solid.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Pomodoro
            </p>
          </router-link>

          <router-link
            to="/calendarToDo"
            class="flex items-center gap-6 hover:scale-105 duration-150"
          >
            <img src="/icons/calendar.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Calendar
            </p>
          </router-link>


          <a class="flex items-center gap-6 hover:scale-105 duration-150">
            <img src="/icons/shield-halved-solid.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Blocker
            </p>
          </a>

          <router-link
            to="/analyticsDashboard"
            class="flex items-center gap-6 hover:scale-105 duration-150"
          >
            <img src="/icons/chart-simple-solid.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Analytics
            </p>
          </router-link>

          <a
            @click="showSpotifyWidget"
            class="flex items-center gap-6 hover:scale-105 duration-150"
          >
            <img src="/icons/spotify.svg" class="h-14 w-14 cursor-pointer" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Spotify
            </p>
          </a>

          <a class="flex items-center gap-6 hover:scale-105 duration-150">
            <img src="/icons/dove-solid.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Pet!
            </p>
          </a>

          <router-link to="/profile" class="flex items-center gap-6 hover:scale-105 duration-150">
            <img src="/icons/user-solid.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              User Profile
            </p>
          </router-link>

          <router-link
            to="/friendsPage"
            class="flex items-center gap-6 hover:scale-105 duration-150"
          >
            <img src="/icons/friends-soild.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Friends
            </p>
          </router-link>

          <router-link
            to="/quackPalPage"
            class="flex items-center gap-6 hover:scale-105 duration-150"
          >
            <img src="/icons/store.svg" class="h-14 w-14" />
            <p class="hidden group-hover:block group-hover:w-[5.5rem] text-start text-white">
              Store
            </p>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Spotify Widget Overlay-->
    <div v-if="isSpotifyWidgetVisible" class="z-50">
      <SpotifyWidget @close="isSpotifyWidgetVisible = false"></SpotifyWidget>
    </div>

    <main>
      <slot />
    </main>
  </Background>
</template>

<script>
import Background from './Background.vue'
import SpotifyWidget from '@/components/widgets/Spotify.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'PageLayout',
  components: {
    SpotifyWidget,
    Background
  },
  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  },
  data() {
    return {
      backgroundStyle: localStorage.getItem('backgroundStyle') || 'default',
      isDropdownVisible: false,
      isSpotifyWidgetVisible: false,
      user: false
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible
    },

    showSpotifyWidget() {
      this.isSpotifyWidgetVisible = !this.isSpotifyWidgetVisible
    }
  }
}
</script>

<style scoped>
main {
  height: calc(100vh - 6rem);
}

#navbar {
  max-height: calc(100vh - 8rem);
}
</style>
