<script>

export default {
  data() {
    return {}
  },

  props: {
    isLoading: Boolean,
    showLink: Boolean,
    anchor: String,
    showMore: Boolean
  },

  computed: {
    link() {
      return this.anchor || '#'
    }
  }
}
</script>

<template>
  <div class="result">
    <span class="results-loading" v-if="isLoading"><div class="loading"></div></span>
    <a 
      :href="link"
      :class="{ 'link--show-more': showMore }"
      v-if="!isLoading && showLink" 
      >
      <slot />
    </a>
    <span v-if="!isLoading && !showLink"><slot /></span>
  </div>
</template>

<style lang="scss" scoped>
</style>

