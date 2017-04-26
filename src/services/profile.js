import { Observable } from 'rxjs';
import device from 'react-native-device-info';
import dateFormatter from '../formatters/date';
import api from './api';
import cache from './cache';
import tokenService from './token';
import settings from '../settings';

class ProfileService {

  constructor(apit, settings, cache, tokenService, dateFormatter) {
    this.api = api;
    this.settings = settings;
    this.cache = cache;
    this.tokenService = tokenService;
    this.dateFormatter = dateFormatter;
  }

  register(provider, accessToken) {
    const deviceId = device.getUniqueID();
    const application = this.settings.churchSlug;
    const name = `${device.getManufacturer()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;

    return this.api.post('/register', { deviceId, name, application, provider, accessToken }).flatMap(res => {
      return this.tokenService.setToken(res.json());
    });
  }

  get(refresh = false) {
    return this.tokenService.getToken().first().flatMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      const stream$ = this.api.get('profile').map(res => res.json());
      return this.cache.from('service-profile', stream$, refresh).map(profile => {
        return this.dateFormatter.parseObj(profile);
      });
    });
  }

}

export default new ProfileService(api, settings, cache, tokenService, dateFormatter);