<template>
  <div v-html="pageContent"></div>
</template>

<script>
export default {
  data() {
    return {
      pageContent: ''
    }
  },
  mounted() {
    const pageName = this.$route.params.pageName
    // Load VitePress page content
    fetch(`/docs/${pageName}.html`)
      .then((response) => response.text())
      .then((html) => {
        this.pageContent = html
      })
      .catch((error) => {
        console.error('Error loading page:', error)
      })
  }
}
</script>
