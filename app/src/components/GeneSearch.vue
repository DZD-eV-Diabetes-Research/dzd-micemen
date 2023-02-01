<script>

import Result from './Result.vue'

import config from '../lib/config';

import {
  getPubMedResultsforOrganism,
  getOrthologGenes,
  getPharos,
  getMelodiPresto
} from '../lib/api';

import { 
  capitalize, 
  decapitalize 
} from '../lib/helper';


export default {
  data() {
    // init organisms specific result object for pubmed
    var pubmed = {};
    for (const organism of config.organisms) {
      pubmed[organism] = {
        publications: [],
        isLoading: false
      };
    };

    return {
      gene: '',                     // requested gene
      organisms: config.organisms,  // array of all supported organisms

      results: {
        show: false,                // shows result tables
        orthologueGenes: {},        // state for ortholgue results
        pubmed: pubmed,             // state of pubmed results
        pharos: {
          isLoading: false,
          results: {}
        },
        melodiPresto: {}
      },

      details: {
        showDetails: false,
        source: null,
        organism: null
      }
    }
  },

  methods: {
    capitalize,

    // Triggers requests to all apis and shows result table
    search: function () {
      this.results.show = true;

      this.loadOrthologueGenes();
      this.loadPubmed();
      this.loadPharos();
    },

    // shows detail results table
    showDetails (source, organism) {
      this.details.source = source;
      this.details.organism = organism;
      this.details.show = true;
    },

    // load orthologue genes from api
    async loadOrthologueGenes () {
      var result = this.results.orthologueGenes;
      result.isLoading = true;
      result.organisms = await getOrthologGenes(this.gene);
      result.isLoading = false;
    },

    // load pub med results from api
    loadPubmed () {
      // request pubmed results for all organisms
      for (const organism of this.organisms) {
        this.loadPubmedforOrganism(organism);
      }
    },

    async loadPubmedforOrganism (organism) {
      // init initial data structure
      if (!this.results.pubmed.hasOwnProperty(organism)) {
        this.results.pubmed[organism] = {
          publications: [],
          isLoading: false
        }
      }
      var result = this.results.pubmed[organism];
      result.isLoading = true;

      result.publications = await getPubMedResultsforOrganism(organism, this.gene);
  
      result.isLoading = false;
    },

    async loadPharos () {
      this.results.pharos.isLoading = true;
      this.results.pharos.results = await getPharos(this.gene);
      this.results.pharos.isLoading = false;
    },

    async loadMelodiPresto () {
      this.results.melodiPresto.isLoading = true;
      this.results.melodiPresto.results = await getMelodiPresto(this.gene);
      this.results.melodiPresto.isLoading = false;
    }
  },

  components: {
    Result
  }
};

</script>

<template>
  <section class="query">
    <h2>Query</h2>
    <form class="form" @submit.prevent="search()">
      <div class="form__group">
        <label for="gene" class="form__label query-label">Human Gene</label>
        <input type="text" name="gene" v-model="gene" class="form__control query-input" placeholder="Enter gene" />
        <span class="form__help-text">Name of the human gene, e.g. "FOXA2", case insensitive.</span>
      </div>

      <input type="submit" value="Search" />
    </form>
  </section>

  <section class="result-table" v-if="results.show">
    <h2>Results</h2>

    <table class="table results">
      <tr>
        <th>Source</th>
        <th v-for="organism in organisms" :key="organism">{{ capitalize(organism) }}</th>
      </tr>
      <tr>
        <td>Orthologues</td>
        <td v-for="organism in organisms" :key="organism" >
          <Result 
            v-if="results.orthologueGenes.organisms[organism]"
            :is-loading="results.orthologueGenes.isLoading"
            :show-link="false"
            :title="`SID: ${results.orthologueGenes.organisms[organism].SID}, Name: ${results.orthologueGenes.organisms[organism].Name} `"
            >{{ results.orthologueGenes.organisms[organism].Symbol }}</Result>
        </td>
      </tr>
      <tr>
        <td><a href="https://pubmed.ncbi.nlm.nih.gov/" target="new">PubMed</a></td>
        <td v-for="organism in organisms" :key="organism">
          <Result 
            :is-loading="results.pubmed[organism].isLoading"
            @click.prevent="showDetails('pubmed', organism)"
            :show-link="true"
            >{{ results.pubmed[organism].publications.length }}</Result>
        </td>
      </tr>
    </table>

    <h3>Not organism-specific</h3>

    <table class="table results">

      <tr>
        <td><a href="https://pharos.nih.gov/" target="new">Pharos</a></td>
        <td>
          <Result 
            :is-loading="results.pharos.isLoading"
            @click.prevent="showDetails('pharos', 'human')"
            :show-link="true"
            >{{ results.pharos.results ? 'Show result': 'no result' }}</Result>
        </td>
      </tr>
      <!--tr>
        <td>Melodi Presto</td>
        <td>
          <Result 
            :is-loading="results.melodiPresto.isLoading"
            @click.prevent="showDetails('melodiPresto', 'human')"
            >{{ results.pharos.results ? 'Show result': 'no result' }}</Result>
        </td>
      </tr-->
    </table>
  </section>

  <section class="result-details" v-if="details.show">

    <div v-if="details.source == 'pubmed'">
      <h3>Publications in <b>{{ details.source }}</b> for <b>{{ details.organism }}</b> mentioning <b>{{ gene }}</b>: {{ results[ details.source ][ details.organism ].publications.length }} Results</h3>
      <table>
        <tr v-for="pub in results[ details.source ][ details.organism ].publications">
          <td>{{ pub.pmId }}</td>
          <td><a :href="pub.link" target="_new">{{ pub.title }}</a></td>
        </tr>
      </table>
    </div>
    <div v-if="details.source == 'pharos'">
      <h2>Pharos Data for {{ gene }} in {{ details.organism }}</h2>
      <ul>
        <li>Name: <b>{{ results.pharos.results.name }}</b></li>
        <li>tdl: <b>{{ results.pharos.results.tdl }}</b></li>
        <li>fam: <b>{{ results.pharos.results.fam }}</b></li>
        <li>novelty: <b>{{ results.pharos.results.novelty }}</b></li>
      </ul>
    </div>
    <div v-if="details.source == 'melodiPresto'">
      <h2>Pharos Data for {{ gene }} in {{ details.organism }}</h2>
      <ul>
        <li>Name: <b>{{ results.melodiPresto.results.name }}</b></li>
        <li>tdl: <b>{{ results.pharos.results.tdl }}</b></li>
        <li>fam: <b>{{ results.pharos.results.fam }}</b></li>
        <li>novelty: <b>{{ results.pharos.results.novelty }}</b></li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}
th, td {
  padding: 3px 10px;
  border: 1px solid var(--primary12);
}

.query {
  padding: var(--space-6);
  background-color: var(--primary1);
  border-radius: 8px;

  --button-bg-color: var(--accent);
  --button-text-color: var(--white);

  h2 {
    margin-top: 0;
  }
}
</style>
