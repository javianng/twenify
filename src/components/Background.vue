<template>
  <div :class="backgroundClass" class="h-screen flex flex-col">
    <main>
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'Background',
  props: {
    style: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    backgroundClass() {
      switch (this.style) {
        case 'style1':
          return 'bg-gradient-to-b to-tPurple from-tDarkPurple'
        case 'style2':
          return 'bg-gradient-to-r from-green-400 to-blue-500'
        case 'style3':
          return 'bg-gradient-to-l from-yellow-300 via-red-500 to-pink-500'
        default:
          return 'bg-gradient-to-b to-tPurple from-tDarkPurple'
      }
    }
  }
}
</script>
