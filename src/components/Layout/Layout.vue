<template>
  <Header />
  <div class="layout">
    <div class="layout__content">
      <slot />
    </div>
  </div>
  <Footer />
</template>
<script>
  import Footer from './Footer.vue';
  import Header from './Header.vue';
  export default {
    name: 'Layout',
    components: {
      Footer, Header,
    }
  }
</script>
<style lang="scss">

</style>