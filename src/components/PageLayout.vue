<template>
  <Background :style="backgroundStyle">
    <div class="flex justify-between px-8 h-fit">
      <!-- Logo Container with click event to toggle dropdown -->
      <div
        @click="toggleDropdown"
        class="bg-neutral-800 h-24 w-24 flex items-center justify-center cursor-pointer"
      >
        <img src="/twenifyLogo.svg" alt="logo" class="h-16 items-center" />
      </div>
      <div class="flex items-center">
        <router-link to="/">
          <img src="/twenifyLogoName.png" alt="logo" class="h-16" />
        </router-link>
      </div>
    </div>

    <!-- Dropdown Content -->
    <div v-if="isDropdownVisible" class="relative">
      <div class="absolute">
        <nav
          class="bg-neutral-800 w-24 flex mx-8 gap-7 items-center flex-col pb-4 rounded-b-lxl shadow-lg h-[50vh] overflow-scroll justify-center"
        >
          <router-link to="/dashboard">
            <img src="/icons/clock-solid.svg" class="h-14 w-14" />
          </router-link>
          <a><img src="/icons/shield-halved-solid.svg" class="h-14 w-14" /></a>
          <router-link to="/analyticsDashboard">
            <img src="/icons/chart-simple-solid.svg" class="h-14 w-14" />
          </router-link>
          <a @click="showSpotifyWidget">
            <img src="/icons/spotify.svg" class="h-14 w-14 cursor-pointer"
          /></a>
          <a><img src="/icons/dove-solid.svg" class="h-14 w-14" /></a>
          <router-link to="/profile">
            <img src="/icons/user-solid.svg" class="h-14 w-14" />
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
      // Dropdown visibility state
      isDropdownVisible: false,
      // Spotify widget visibility state
      isSpotifyWidgetVisible: false,
      user: false
    }
  },
  methods: {
    // Toggle dropdown visibility
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible
    },
    // Toggle Spotify widget visibility
    showSpotifyWidget() {
      this.isSpotifyWidgetVisible = !this.isSpotifyWidgetVisible
    }
  }
}
</script>
