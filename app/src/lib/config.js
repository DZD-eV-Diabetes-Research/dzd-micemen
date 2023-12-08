// app wide configurations

const config = {
  //apiBaseUrl: 'https://restapi.connect.dzd-ev.de/mouseclinic/',
  apiBaseUrl: window.Env['API_SERVER_BASE_URL'] || '/mouseclinic/',
  // apiBasePath: 'https://api-micemen.dzd-ev.org/',
  apiBasePath: window.Env['API_SERVER_BASE_PATH'] || '/',
  // used to build organim-specific table columns and API endpoints
  organisms: ['human', 'mouse', 'zebrafish', 'rat', 'pig', 'c_elegans', 'fruitFly'],
  defaultLimit: 20
};

export default config;