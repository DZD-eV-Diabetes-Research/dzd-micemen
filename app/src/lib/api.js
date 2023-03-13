// Contains async functions to request internal and external APIs

import config from './config';
import { capitalize, decapitalize } from './helper';


/**
 * Get PubMed Articles from Neo4J Graph for a gene in a specific organism
 * Requires specific endpoint for given organism
 * API Docs: https://restapi.connect.dzd-ev.de/docs
 * 
 * @param {String} organism 
 * @param {String} gene 
 * @returns Array of article objects
 */
export async function getPubMedResultsforOrganism (organism, gene) {
  const url = config.apiBaseUrl + 'get' + capitalize(organism) + '/?g=' + gene;
  var results = await (await fetch(url)).json();
  return results;
};

/**
 * Get information for ortholog genes to a given human gene for all supported organisms with one request
 * API Docs: https://restapi.connect.dzd-ev.de/docs
 * 
 * @param {String} gene 
 * @returns Object with organism as key
 */
export async function getOrthologGenes (gene) {
  const url = config.apiBaseUrl + 'getOverviewOrthologues/?g=' + gene;
  var results = await (await fetch(url)).json();

  // takes the given array an normalizes it as an object with organism as key for easier use in vue
  var resultsAsObject = {};
  for (const [index, gene] of results.entries()) {
    var organismName = decapitalize(gene.Species);
    resultsAsObject[organismName] = results[index];
  };

  return resultsAsObject;
};

/**
 * Requests information for a given gene from Pharos
 * API Docs & Demo: https://pharos.nih.gov/api
 * 
 * @param {String} gene 
 * @returns Object
 */
export async function getPharos (gene) {
  var query = `query targetDetails{
                target(q:{sym:"${gene}"}) {
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

  var result = results.data.target;
  return result;
};

/**
 * Requests information from Melodi Presto ENRICH endpoint - proxied by DZD EV
 * Check docs how to use via proxy (different interface):
 * https://restapi.connect.dzd-ev.de/
 * 
 * API Docs: https://melodi-presto.mrcieu.ac.uk/docs/ 
 * Demo: https://melodi-presto.mrcieu.ac.uk/app/enrich/
 * 
 * @param {String} gene 
 * @returns Object
 */
export async function getMelodiPresto (gene) {
  const stringifiedQuery = encodeURIComponent(JSON.stringify({ query: gene }));
  const url = 'https://restapi.connect.dzd-ev.de/melodi/enrich%2F?payload=' + stringifiedQuery;

  var results = await (await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  })).json();

  var decodedResult = JSON.parse(results);

  return decodedResult;
};

export async function getTitleForPubMedIDs (listOfIds) {
  // build query
  var query = '';
  for (const id of listOfIds) query += 'g=' + id + '&';

  const url = config.apiBaseUrl + 'getPudMedID2Title/?' + query;
  var results = await (await fetch(url)).json();
  return results;
};

export async function getGWAS (gene) {
  const url = config.apiBaseUrl + 'getGWASinformation/?g=' + gene;
  var results = await (await fetch(url)).json();
  return results;
};