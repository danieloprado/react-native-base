const env = 'development';
const churchSlug = 'icb-sorocaba';

const apiTimeout = 15 * 1000;
const apiEndpoint = env === 'production' ?
  `https://app.icbsorocaba.com.br/api/app/${churchSlug}` :
  `http://192.168.25.5:3001/api/app/${churchSlug}`;
// `http://10.84.77.199:3001/api/app/${churchSlug}`;


export default { env, churchSlug, apiEndpoint, apiTimeout };