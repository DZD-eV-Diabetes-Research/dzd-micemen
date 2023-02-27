<template>
  <header class="nav">
    <div class="nav__content">
      <div>
        <div class="nav__title">Of Mice And Men</div>
        <div class="nav__subtitle">
          Cross-Organism Gene Meta Search in Public Scientific Databases
        </div>
      </div>
      <div class="nav__logo">
        <img src="/img/logos/dzd.png" alt="">
      </div>
    </div>
  </header>

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
</template>
<script>
  export default {
    name: "Header",
  };
</script>
<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables/breakpoints";

  .nav {
    display: flex;
    width: 100%;
    border-bottom: 10px solid var(--accent);
  }

  .nav__content {
    @include container();
    margin: 0;
    padding: var(--space-4) var(--layout-padding-x);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: var(--nav-height);
    pointer-events: auto;
    transition: height var(--transition-long), background var(--transition-long);
    position: relative;
    z-index: 3;
    background-color: var(--nav-bg-color);
    gap: var(--space-4);
    width: 100%;

    @include breakpoint(md) {
      flex-direction: row;
      align-items: center;
    }
  }

  .nav__title {
    font-size: var(--font-size-2xl);
    font-weight: 800;
    color: var(--primary12);
  }

  .nav__logo {
    width: 200px;
    order: -1;

    @include breakpoint(md) {
      order: inherit;
    }
    img {
      max-width: 100%;
    }
  }

  .about {
    padding: var(--space-6);
  }
</style>
