<template>
  <Background :style="backgroundStyle">
    <div class="flex justify-between px-8 h-24">
      <div
        @click="toggleDropdown"
        class="bg-neutral-800 h-24 w-24 flex items-center justify-center cursor-pointer"
      >
        <img src="/twenifyLogo.png" alt="logo" class="h-16 w-16 items-center" />
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
          id="navbar"
          class="bg-neutral-800 w-24 relative mx-8 shadow-lg rounded-b-xl h-fit pb-4 overflow-scroll"
        >
          <div class="flex h-fit flex-col gap-7 items-center pt-8">
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
            <router-link to="/quackPalPage">
              <img src="/icons/store.svg" class="h-14 w-14" />
            </router-link>
          </div>
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
