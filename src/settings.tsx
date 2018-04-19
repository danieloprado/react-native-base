import { Platform } from 'react-native';

export const env = __DEV__ ? 'development' : 'production';
export const isDevelopment = env === 'development';

export const isiOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const bugsnagFilterEnv = ['production'];

export const apiTimeout = 15 * 1000;
export const apiEndpoint = isDevelopment ?
  `https://your-dev-api` :
  `https://your-api`;

export const themeSettings = {
  primary: '#263238',
  accent: '#86bd90'
};