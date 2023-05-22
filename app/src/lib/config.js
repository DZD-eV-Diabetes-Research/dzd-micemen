// app wide configurations

const config = {
  //apiBaseUrl: 'https://restapi.connect.dzd-ev.de/mouseclinic/',
  apiBaseUrl: 'https://api-micemen.dzd-ev.org/',
  apiBasePath: 'https://api-micemen.dzd-ev.org/mouseclinic/',
  // used to build organim-specific table columns and API endpoints
  organisms: ['human', 'mouse', 'zebrafish', 'rat', 'pig', 'c_elegans', 'fruitFly'],
  defaultLimit: 20
};

export default config;