<template>
  <button
    :class="buttonClass"
    @click="handleClick"
    class="bg-gradient-to-b from-yellow-300 to-purple-700 shadow-md rounded-full py-2 px-5 w-32 text-white"
  >
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    buttonClass: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Button'
    },
    buttonFunction: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleClick() {
      this.buttonFunction()
    }
  }
}
</script>
