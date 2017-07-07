import { Observable, Subject } from 'rxjs';

import api from './api';
import cache from './cache';
import dateFormatter from '../formatters/date';
import device from 'react-native-device-info';
import notificationService from './notification';
import settings from '../settings';
import storageService from './storage';
import tokenService from './token';

class ProfileService {

  constructor() {
    this.profileUpdate$ = new Subject();
  }

  register(provider, accessToken) {
    const deviceId = device.getUniqueID();
    const application = settings.churchSlug;
    const notificationId = notificationService.getUserId();
    const name = `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;

    return api.post('register', { deviceId, name, application, provider, accessToken, notificationId })
      .do(() => storageService.set('notificationRegistred', true))
      .switchMap(res => tokenService.setToken(res));
  }

  get(refresh = false) {
    return tokenService.getToken().switchMap(token => {
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

  logout() {
    return storageService.set('notificationRegistred', false).switchMap(() => {
      return tokenService.clearToken();
    }).switchMap(() => {
      return cache.clear();
    });
  }

  appOpened() {
    return api.connection().filter(c => c).first().switchMap(() => {
      return storageService.get('notificationRegistred');
    }).switchMap(registered => {
      const data = { notificationUserId: registered ? null : notificationService.getUserId() };
      return api.post('profile/app-opened', data);
    }).switchMap(() => {
      return storageService.set('notificationRegistred', true);
    });
  }
}

export default new ProfileService();