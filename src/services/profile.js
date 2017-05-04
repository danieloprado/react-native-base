import device from 'react-native-device-info';
import dateFormatter from '../formatters/date';
import api from './api';
import cache from './cache';
import tokenService from './token';
import settings from '../settings';
import { Observable, Subject } from 'rxjs';

class ProfileService {

  constructor() {
    this.profileUpdate$ = new Subject();
  }

  register(provider, accessToken) {
    const deviceId = device.getUniqueID();
    const application = settings.churchSlug;
    const name = `${device.getManufacturer()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;

    return api.post('register', { deviceId, name, application, provider, accessToken }).flatMap(res => {
      return tokenService.setToken(res);
    });
  }

  get(refresh = false) {
    return tokenService.getToken().flatMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      const stream$ = api.get('profile');
      return cache.from('service-profile', stream$, refresh).map(profile => {
        return dateFormatter.parseObj(profile);
      }).concat(this.profileUpdate$);
    });
  }

  save(model) {
    return api.post('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

}

export default new ProfileService();