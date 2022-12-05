<script>

export default {
  data() {
    return {
      gene: '',

      results: {
        show: false,
        pubmed: {
          human: {
            isLoading: false,
            publications: []
          },
          mouse: {
            isLoading: false,
            publications: []
          }
        },
        pharos: {
          human: {
            isLoading: false,
            results: {}
          }
        }
      },

      details: {
        showDetails: false,
        source: null,
        organism: null
      }
    }
  },

  methods: {
    search: function () {
      this.results.show = true;

      this.getResultsForPubmedHuman();
      this.getResultsForPubmedMouse();
      this.getResultsForPharosHuman();
    },

    showDetails (source, organism) {
      this.details.source = source;
      this.details.organism = organism;
      this.details.show = true;
    },

    async getResultsForPubmedHuman () {
      this.results.pubmed.human.isLoading = true;

      const url = 'https://restapi.connect.dzd-ev.de/mouseclinic/getHuman/?g=' + this.gene;
      var results = await (await fetch(url)).json();
      this.results.pubmed.human.publications = results;

      this.results.pubmed.human.isLoading = false;
    },

    async getResultsForPubmedMouse () {
      this.results.pubmed.mouse.isLoading = true;

      const url = 'https://restapi.connect.dzd-ev.de/mouseclinic/getMouse/?g=' + this.gene;
      var results = await (await fetch(url)).json();
      this.results.pubmed.mouse.publications = results;

      this.results.pubmed.mouse.isLoading = false;
    },

    async getResultsForPharosHuman () {
      this.results.pharos.human.isLoading = true;

      var query = `query targetDetails{
  target(q:{sym:"${this.gene}"}) {
    name
    tdl
    fam
    novelty
  }
}`;
      var request = {
        operation: "targetDetails",
        query: query,
        variables: {}
      };

      const url = 'https://pharos-api.ncats.io/graphql';
      var results = await (await fetch(url, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      })).json();

      this.results.pharos.human.results = results.data.target;

      this.results.pharos.human.isLoading = false;
    }
  }
};

</script>

<template>
  <header>
    <h1>Gene Info</h1>
    <p>You can search for publications which mention a specific gene.</p> 
    <p>The found publications will sorted by Source and Organism.</p>
  </header>
  
  <section class="query">
    <label for="gene" class="query-label"></label>
    <input type="text" name="gene" v-model="gene" class="query-input" placeholder="Enter gene" />

    <input type="submit" value="Search" @click="search()" />
  </section>

  <section class="result-table" v-if="results.show">
    <h2>Results</h2>

    <table class="results">
      <tr>
        <th>Source</th>
        <th>Human</th>
        <th>Mouse</th>
      </tr>
      <tr>
        <td>PubMed</td>
        <td>
          <span class="results-loading" v-if="results.pubmed.human.isLoading">...</span>
          <span 
            class="results-number"
            v-if="!results.pubmed.human.isLoading" 
            @click="showDetails('pubmed', 'human')">
            {{ results.pubmed.human.publications.length }}
          </span>
        </td>
        <td>
          <span class="results-loading" v-if="results.pubmed.mouse.isLoading">...</span>
          <span 
            class="results-number"
            v-if="!results.pubmed.mouse.isLoading" 
            @click="showDetails('pubmed', 'mouse')">
            {{ results.pubmed.mouse.publications.length }}
          </span>
        </td>
      </tr>

      <tr>
        <td>Pharos</td>
        <td>
          <span class="results-loading" v-if="results.pharos.human.isLoading">...</span>
          <span 
            class="results-number"
            v-if="!results.pharos.human.isLoading" 
            @click="showDetails('pharos', 'human')">
            {{ results.pharos.human.results ? '1':'' }}
          </span>
        </td>
        <td>
        </td>
      </tr>
    </table>
  </section>

  <section class="result-details" v-if="details.show">

    <div v-if="details.source == 'pubmed'">
      <h2>Publications in <b>{{ details.source }}</b> for <b>{{ details.organism }}</b> mentioning <b>{{ gene }}</b>: {{ results[ details.source ][ details.organism ].publications.length }} Results</h2>
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
        <li>Name: <b>{{ results.pharos.human.results.name }}</b></li>
        <li>tdl: <b>{{ results.pharos.human.results.tdl }}</b></li>
        <li>fam: <b>{{ results.pharos.human.results.fam }}</b></li>
        <li>novelty: <b>{{ results.pharos.human.results.novelty }}</b></li>
      </ul>
    </div>
  </section>
</template>

<style scoped>

html, body, * {
  font-family: Helvetica, Arial, sans-serif;
}
.results-number {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}


table {
  border-collapse: collapse;
}
th, td {
  padding: 3px 10px;
  border: 1px solid black;
}
</style>
