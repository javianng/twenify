<template>
  <div class="bg-gradient-to-b to-tPurple from-tDarkPurple h-full min-h-screen flex flex-col">
    <div class="flex justify-between px-8 h-fit">
      <!-- Logo Container with click event to toggle dropdown -->
      <div
        @click="toggleDropdown"
        class="bg-neutral-800 h-24 w-24 flex items-center justify-center cursor-pointer"
      >
        <img src="/twenifyLogo.svg" alt="logo" class="h-16" />
      </div>
      <div class="flex items-center">
        <div class="flex items-end">
          <img src="/twenifyLogo.svg" alt="logo" class="h-16" />
          <img src="/twenifyName.svg" alt="twenify" class="h-14" />
        </div>
      </div>
    </div>

    <!-- Dropdown Content -->
    <div v-if="isDropdownVisible" class="relative">
      <div class="absolute">
        <nav
          class="bg-neutral-800 w-24 flex mx-8 gap-3 items-center flex-col pb-4 rounded-b-lxl shadow-lg"
        >
          <!-- Temp links -->
          <router-link to="/" class="text-white"><p>Home</p></router-link>
          <router-link to="/dashboard" class="text-white"><p>Dashboard</p></router-link>
          <router-link to="/register" class="text-white"><p>Register</p></router-link>
          <router-link to="/sign-in" class="text-white"><p>Sign-In</p></router-link>

          <!-- Dropdown items go here -->
          <a href="/">
            <img src="/spotify.svg" class="bg-white h-16 w-16" />
          </a>
          <a href="/">
            <img src="/spotify.svg" class="bg-white h-16 w-16" />
          </a>
          <a href="/">
            <img src="/spotify.svg" class="bg-white h-16 w-16" />
          </a>
          <a href="/">
            <img src="/spotify.svg" class="bg-white h-16 w-16" />
          </a>
          <a href="/">
            <img src="/spotify.svg" class="bg-white h-16 w-16" />
          </a>
          <img src="/spotify.svg" class="bg-white h-16 w-16" />
          <img src="/spotify.svg" class="bg-white h-16 w-16" />
          <img src="/spotify.svg" class="bg-white h-16 w-16" />
        </nav>
      </div>
    </div>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PageLayout',
  data() {
    return {
      // Dropdown visibility state
      isDropdownVisible: false
    }
  },
  methods: {
    // Toggle dropdown visibility
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible
    }
  }
}
</script>
