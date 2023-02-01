<script>

export default {
  data() {
    return {}
  },

  props: {
    isLoading: Boolean,
    showLink: Boolean,
  }
}
</script>

<template>
  <div class="result">
    <span class="results-loading" v-if="isLoading">...</span>
    <a 
      href="#"
      class="results-number"
      v-if="!isLoading && showLink" 
      >
      <slot />
    </a>
    <span v-if="!isLoading && !showLink"><slot /></span>
  </div>
</template>

<style lang="scss" scoped>
</style>

