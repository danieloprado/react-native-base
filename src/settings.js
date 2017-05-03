const env = 'development';
// const env = 'production';
const churchSlug = 'icb-sorocaba';

const apiTimeout = 15 * 1000;
const apiEndpoint = env === 'production' ?
  `https://app.icbsorocaba.com.br/api/app/${churchSlug}` :
  // `http://192.168.25.5:3001/api/app/${churchSlug}`;
  `http://10.84.77.199:3001/api/app/${churchSlug}`;


const googleApi = {
  iosClientid: '808003968903-f53sinpkpe1sjc8jtaauho5ouemo1ere.apps.googleusercontent.com',
  webClientId: '808003968903-apaspmu2kabjhpdv88ki1brmtgqv4o6r.apps.googleusercontent.com'
};


export default { env, churchSlug, apiEndpoint, apiTimeout, googleApi };