<script>

import Result from './Result.vue'
import Modal from './Modal.vue'

import config from '../lib/config';

import {
  getPubMedResultsforOrganism,
  getOrthologGenes,
  getPharos,
  getGWAS,
  getMelodiPresto,
  getTitleForPubMedIDs
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
        melodiPresto: {
          results: [],
          publicationsForResult: [],
          showDetailsFor: null
        },
        gwas: {
          results: [],
          isLoading: false
        }
      },

      details: {
        showDetails: false,
        source: null,
        organism: null,

        limit: config.defaultLimit,
        defaultLimit: config.defaultLimit,
        noLimit: -1
      },

      modal: {
        show: false,
        type: '',
        data: {}
      }
    }
  },

  /**
   * Is called as a constructor and automatically searches for gene passed in query with ?gene=GENE_NAME
   */
  mounted () {
    let query = window.location.search;
    // make sure URLSearchParams is supported
    if (URLSearchParams) {
      let params = new URLSearchParams(query);
      if (params.has('gene')) {
        // when query param "gene" is defined prefill form and trigger search
        this.gene = params.get('gene');
        this.search();
      }
    }
  },

  methods: {
    capitalize,

    setLimit: function (limit) {
      this.details.limit = limit;
    },
    // Triggers requests to all apis and shows result table
    search: function () {
      this.results.show = true;

      this.loadOrthologueGenes();
      this.loadPubmed();
      this.loadPharos();
      this.loadMelodiPresto();
      this.loadGWAS();
    },

    // is triggered when input is changed
    hideResults: function () {
      console.log("hide details");
      this.results.show = false;
    },

    // shows detail results table
    showDetails (source, organism) {
      this.details.source = source;
      this.details.organism = organism;
      this.details.show = true;
      this.setLimit(this.details.defaultLimit);
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

    showMelodiPrestoDetails(result) {
      // load publication
      this.loadMelodiPrestoPubTitles(result.pmids);
      // provide data for data and trigger UI to show it
      this.results.melodiPresto.showDetailsFor = result;
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
    },

    async loadMelodiPrestoPubTitles (publicationList) {
      var publications = publicationList.split(" ");

      this.results.melodiPresto.publicationsForResult = await getTitleForPubMedIDs(publications);
    },

    async loadGWAS () {
      this.results.gwas.isLoading = true;
      this.results.gwas.results = await getGWAS(this.gene);
      this.results.gwas.isLoading = false;
    },

    showModal: function(type, data) {
      this.modal.type = type;
      this.modal.data = data;
      this.modal.show = true;
    }

  },

  components: {
    Result,
    Modal
  }
};

</script>

<template>
  <!-- QUERY -->
  <section class="query">
    <h2>Query</h2>
    <form class="form" @submit.prevent="search()">
      <div class="form__group">
        <label for="gene" class="form__label query-label">Human Gene</label>
        <input 
          type="text" 
          name="gene" 
          v-model="gene" 
          class="form__control query-input" 
          placeholder="Enter gene" 
          @keyup="hideResults" />
        <span class="form__help-text">Name of the human gene, e.g. "FOXA2", case insensitive.</span>
      </div>

      <div class="loading"></div>

      <input type="submit" value="Search" />
    </form>
  </section>

  <section class="result-table" v-if="results.show">
    <!-- RESULTS: Organism Specific -->
    <h2>Results</h2>

    <table class="table results">
      <tr>
        <th>Source</th>
        <th v-for="organism in organisms" :key="organism">{{ capitalize(organism) }}</th>
      </tr>
      <tr>
        <td class="source">Orthologues</td>
        <td v-for="organism in organisms" :key="organism" >
          <Result 
            v-if="results.orthologueGenes.organisms && results.orthologueGenes.organisms[organism]"
            :is-loading="results.orthologueGenes.isLoading"
            :show-link="false"
            class="link--more-info"
            @click="showModal('orthologue', results.orthologueGenes.organisms[organism])"
            >{{ results.orthologueGenes.organisms[organism].Symbol }}</Result>
        </td>
      </tr>
      <tr>
        <td class="source"><a href="https://pubmed.ncbi.nlm.nih.gov/" class="link--external" target="new">PubMed</a></td>
        <td v-for="organism in organisms" :key="organism">
          <Result 
            :is-loading="results.pubmed[organism].isLoading"
            @click.prevent="showDetails('pubmed', organism)"
            :show-link="!!results.pubmed[organism].publications.length"
            :show-more="!!results.pubmed[organism].publications.length"
            >{{ results.pubmed[organism].publications.length }}</Result>
        </td>
      </tr>
    </table>

    <!-- RESULTS: Not Organism Specific -->
    <h3>Not organism-specific</h3>

    <table class="table results">
      <tr>
        <th>Source</th>
        <th>Results</th>
      </tr>
      <tr>
        <td class="source"><a href="https://pharos.nih.gov/" class="link--external" target="new">Pharos</a></td>
        <td>
          <Result 
            :is-loading="results.pharos.isLoading"
            @click.prevent="showDetails('pharos', 'human')"
            :show-link="true"
            :show-more="!!results.pharos.results"
            >{{ results.pharos.results ? 'Show result': 'no result' }}</Result>
        </td>
      </tr>
      <tr>
        <td class="source"><a href="https://melodi-presto.mrcieu.ac.uk/app/enrich/" class="link--external" target="new">Melodi Presto</a></td>
        <td>
          <Result 
            :is-loading="results.melodiPresto.isLoading"
            :show-link="true"
            :show-more="results.melodiPresto.results.length > 0"
            @click.prevent="showDetails('melodiPresto', 'human')"
            >{{ results.melodiPresto.results.length > 0 ? 'Show result': 'no result' }}</Result>
        </td>
      </tr>

      <tr>
        <td class="source"><a href="https://www.ebi.ac.uk/gwas/" class="link--external" target="new">GWAS</a></td>
        <td>
          <Result 
            :is-loading="results.gwas.isLoading"
            @click.prevent="showDetails('gwas', 'human')"
            :show-link="true"
            :show-more="results.gwas.results.length > 0"
            >{{ results.gwas.results && results.gwas.results.length > 0  ? 'Show result': 'no result' }}</Result>
        </td>
      </tr>
    </table>
  </section>

  <section class="result-details" v-if="details.show">
    <!-- RESULT DETAILS: PubMed -->
    <div v-if="details.source == 'pubmed'">
      <h3>Publications in <b>{{ details.source }}</b> for <b>{{ details.organism }}</b> mentioning <b>{{ gene }}</b>: {{ results[ details.source ][ details.organism ].publications.length }} Results</h3>
      <table>
        <tr>
          <th>PMID</th>
          <th>Year</th>
          <th>Titel</th>
          <th>Type</th>
        </tr>
        <tr v-for="pub in results[ details.source ][ details.organism ].publications.slice(0, details.limit)">
          <td>{{ pub.pmId }}</td>
          <td>{{ pub.Year }}</td>
          <td><a :href="pub.link" class="link--external" target="_new">{{ pub.title }}</a></td>
          <td>{{ pub.PublicationType }}</td>
        </tr>
      </table>
      <span 
        class="link--show-more link--show-more-results" 
        @click="setLimit(details.noLimit)" 
        v-if="results[ details.source ][ details.organism ].publications.length >= details.defaultLimit && details.limit != -1">
          Show all {{ results[ details.source ][ details.organism ].publications.length }} Results
    </span>
    </div>

    <!-- RESULT DETAILS: Pharos -->
    <div v-if="details.source == 'pharos'">
      <h2>Pharos Data for {{ gene }} in {{ details.organism }}</h2>
      <dl>
        <dt>Name</dt><dd>{{ results.pharos.results.name }}</dd>
        <dt>tdl</dt><dd>{{ results.pharos.results.tdl }}</dd>
        <dt>fam</dt><dd>{{ results.pharos.results.fam }}</dd>
        <dt>
          <a 
            href="#" 
            class="link--more-info"
            @click.prevent="showModal('pharos-novelity-info', results.orthologueGenes.organisms[organism])">
            Novelity</a>
        </dt>
        <dd>{{ results.pharos.results.novelty }}</dd>
      </dl>
    </div>

    <!-- RESULT DETAILS: GWAS -->
    <div v-if="details.source == 'gwas'">
      <h2>GWAS results for {{ gene }}</h2>
      <table>
        <tr>
          <th>Result</th>
          <th>SNP</th>
          <th>Trait</th>
        </tr>
        <tr v-for="result in results.gwas.results">
          <td><a :href="result.Link"  class="link--external" target="_new">{{ result.Gene }}</a></td>
          <td>{{ result.SNP }}</td>
          <td>{{ result.Trait }}</td>
        </tr>
      </table>
    </div>

    <!-- RESULT DETAILS: Melodi Presto -->
    <div v-if="details.source == 'melodiPresto'">
      <h2>Melodi Presto Data for {{ gene }} in {{ details.organism }}</h2>
      <table>
        <tr>
          <th>Subject</th>
          <th>Predicate</th>
          <th>Object</th>
          <th>Pval</th>
          <th>Results</th>
          <th>Show Details</th>
        </tr>
        <tr v-for="result in results.melodiPresto.results.slice(0, details.limit)">
          <td class="truncate">{{ result.subject_name }}</td>
          <td class="truncate">{{ result.predicate }}</td>
          <td class="truncate">{{ result.object_name }}</td>
          <td>{{ Number.parseFloat(result.pval).toExponential(3) }}</td>
          <td>{{ result.localCount }}</td>
          <td><a href="#melodi-details" class="link--show-more" @click="showMelodiPrestoDetails(result)">Show Details</a></td>
        </tr>
      </table>

      <div 
        class="link--show-more link--show-more-results" 
        @click="setLimit(details.noLimit)" 
        v-if="results.melodiPresto.results.length >= details.defaultLimit && details.limit != -1">
          Show all {{ results.melodiPresto.results.length }} Results
        </div>

      <div v-if="results.melodiPresto.showDetailsFor" id="melodi-details">
        <h2>Publications for selected triple {{ results.melodiPresto.showDetailsFor.triple }}</h2>

        <table>
          <tr>
            <th>PMID</th>
            <th>Title</th>
          </tr>
          <tr v-for="pub in results.melodiPresto.publicationsForResult">
            <td>{{ pub.PMID }}</td>
            <td><a :href="pub.link" class="link--external" target="_new">{{ pub.title }}</a></td>
          </tr>
        </table>
      </div>

    </div>
  </section>

  <!-- MODAL -->
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal :show="modal.show" @close="modal.show = false">
      <template #body>
        <div>
        
        <div v-if="modal.type == 'orthologue'">
          <h3>{{ modal.data.Symbol }}</h3>
          <dl>
            <dt>Species:</dt><dd>{{ modal.data.Species }}</dd>
            <dt>Name:</dt><dd>{{ modal.data.Name }}</dd>
            <dt>Source:</dt><dd>{{ modal.data.Source }}</dd>
            <dt>SID:</dt><dd>{{ modal.data.SID }}</dd>
          </dl>
        </div>

        <div v-if="modal.type == 'pharos-novelity-info'">
          <h3>Novelity at Pharos</h3>
          <p>
            Metric for the relative scarcity of specific publications for target (range 0 to 1). 
          </p>
          <p>
            See <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5870731/" class="link--external" target="_new">reference</a> for details.
          </p>
        </div>
      </div>
        
      </template>
    </modal>
  </Teleport>
</template>

<style lang="scss">

/* External links with indicator */
.link--external {
  background-image: url('/icons/external.svg');
  background-repeat: no-repeat;
  background-size: 0.8rem;
  background-position: right center;
  padding-right: 1em; 
  text-decoration-color: var(--primary7);
}

/* CTA Links which show additional data, e.g. table */
.link--show-more {
  font-weight: 700;
  cursor: pointer;
  color: var(--link-color);
  text-decoration: underline;

  &.link--show-more-results {
    display: inline-block;
    margin: 1em 0;
  }
}

/* Links which open */
.link--more-info {
  background-image: url('/icons/info.svg');
  background-repeat: no-repeat;
  background-size: 1em 1em;
  background-position: right center;
  padding-right: 1em; 
  text-decoration: dashed underline;
  display: inline-block;
  cursor: pointer;
  color: var(--color-body);
}

table {
  border-collapse: collapse;

  th, td {
  padding: 3px 10px;
  border: 1px solid var(--primary12);
}

  th, td.source, td.source a {
    font-weight: bold;
  }
}

.truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.result-table {
  padding: var(--space-6);
  background-color: var(--primary1);
  border-radius: 8px;
  margin-top: 1em;
}

.loading {
  background-image: url('/icons/loading.svg');
  background-repeat: no-repeat;
  width: 1em;
  height: 1em;
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}



dl {
  dt {
    font-weight: normal;
    font-style: oblique;
  }

  dd {
    margin: 0 0 0.5rem 1rem;
    font-weight: bold;
  }
}
</style>
