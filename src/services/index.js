import { Container } from './container';
import addressFactory from './factories/address';
import apiFactory from './factories/api';
import cacheFactory from './factories/cache';
import churchFactory from './factories/church';
import churchReportFactory from './factories/churchReport';
import eventFactory from './factories/event';
import facebookFactory from './factories/facebook';
import googleFactory from './factories/google';
import informativeFactory from './factories/informative';
import logFactory from './factories/log';
import notificationFactory from './factories/notification';
import profileFactory from './factories/profile';
import settingsFactory from './factories/settings';
import storageFactory from './factories/storage';
import tokenFactory from './factories/token';


const container = new Container();

container.register('addressService', addressFactory);
container.register('apiService', apiFactory);
container.register('cacheService', cacheFactory);
container.register('churchReportService', churchReportFactory);
container.register('churchService', churchFactory);
container.register('eventService', eventFactory);
container.register('facebookService', facebookFactory);
container.register('googleService', googleFactory);
container.register('informativeService', informativeFactory);
container.register('logService', logFactory);
container.register('notificationService', notificationFactory);
container.register('profileService', profileFactory);
container.register('settings', settingsFactory);
container.register('storageService', storageFactory);
container.register('tokenService', tokenFactory);

export default {
  get(key) {
    return container.get(key);
  }
};