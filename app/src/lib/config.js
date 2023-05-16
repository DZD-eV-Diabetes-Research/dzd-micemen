// app wide configurations

const config = {
  //apiBaseUrl: 'https://restapi.connect.dzd-ev.de/mouseclinic/',
  apiBaseUrl: 'http://kp4.kaiser-preusse.com:8000/',
  apiBasePath: 'http://kp4.kaiser-preusse.com:8000/mouseclinic/',
  // used to build organim-specific table columns and API endpoints
  organisms: ['human', 'mouse', 'zebrafish', 'rat', 'pig', 'c_elegans', 'fruitFly'],
  defaultLimit: 20
};

export default config;