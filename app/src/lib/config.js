// app wide configurations

const config = {
  //apiBaseUrl: 'https://restapi.connect.dzd-ev.de/mouseclinic/',
<<<<<<< HEAD
  apiBaseUrl: 'https://api-micemen.dzd-ev.org/',
  apiBasePath: 'https://api-micemen.dzd-ev.org/mouseclinic/',
=======
  apiBaseUrl: window.Env['API_SERVER_BASE_URL'] || '/',
  // apiBasePath: 'https://api-micemen.dzd-ev.org/',
  apiBasePath: window.Env['API_SERVER_BASE_PATH'] || '/',
>>>>>>> development
  // used to build organim-specific table columns and API endpoints
  organisms: ['human', 'mouse', 'zebrafish', 'rat', 'pig', 'c_elegans', 'fruitFly'],
  defaultLimit: 20
};

export default config;