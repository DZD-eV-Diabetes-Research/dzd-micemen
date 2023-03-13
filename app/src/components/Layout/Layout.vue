<template>
  <Header />

  <div class="layout">
    <div class="layout__content">

      <section class="about">
        <h2>About</h2>
      <p>
        Of Mice And Men web app is the result of a cooperation between the data management team of German Center for Diabetes Research (DZD) and German Mouse Clinic (GMC). It is intended for scientists who want to simplify their initial research about a specified gene. Therefore it shows cross-species results of publications for the gene in request, based on PubMed. It also gives an overview of results for human genes from different databases like GWAS, Pharos and Melodi Presto.
      </p>

        <h2>How-to</h2>
        <p>
          Enter a single gene name (e.g. FOXA2). The entry allows for case insensitive spelling, however the cross-organism research always uses the human gene as a starting point and leads to ortologs from there.
        </p>
      </section>

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
  .layout {
    padding-top: 0 !important;
  }
</style>