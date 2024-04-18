<template>
  <button
    :class="buttonClass"
    @click="handleClick"
    id="btn"
    class="bg-gradient-to-b from-yellow-300 to-purple-700 shadow-md rounded-full py-2 px-5 min-w-32 text-white"
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

<style scoped>
#btn {
  text-align: center;
  margin: auto;
}

#btn:hover {
  color: rgb(243, 236, 236);
  background-color: rgb(255, 94, 0);
  box-shadow: 3px 3px 3px grey;
}
</style>
