export const env = __DEV__ ? 'development' : 'production';
export const isDevelopment = env === 'development';

export const churchSlug = 'icb-sorocaba';
export const defaultAddress = {
  state: 'SP',
  city: 'Sorocaba'
};

export const apiTimeout = 15 * 1000;
export const apiEndpoint = env === 'production' ?
  `https://app.icbsorocaba.com.br/api/app/${churchSlug}` :
  // `http://10.84.77.206:3001/api/app/${churchSlug}`;
  `http://192.168.25.5:3001/api/app/${churchSlug}`;
// `https://app.icbsorocaba.com.br/api/app/${churchSlug}`;

export const googleApi = {
  iosClientId: '808003968903-f53sinpkpe1sjc8jtaauho5ouemo1ere.apps.googleusercontent.com',
  webClientId: '808003968903-apaspmu2kabjhpdv88ki1brmtgqv4o6r.apps.googleusercontent.com'
};