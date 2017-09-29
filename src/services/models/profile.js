import device from 'react-native-device-info';
import { Observable, Subject } from 'rxjs';

import dateFormatter from '../formatters/date';

export class ProfileService {

  constructor(settings, apiService, cacheService, notificationService, storageService, tokenService) {
    this.profileUpdate$ = new Subject();

    this.settings = settings;
    this.apiService = apiService;
    this.cacheService = cacheService;
    this.notificationService = notificationService;
    this.storageService = storageService;
    this.tokenService = tokenService;
  }

  register(provider, accessToken) {
    const deviceId = device.getUniqueID();
    const application = this.settings.churchSlug;
    const notificationId = this.notificationService.getUserId();
    const name = `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;

    return this.apiService.post('register', { deviceId, name, application, provider, accessToken, notificationId })
      .do(() => this.storageService.set('notificationRegistred', true))
      .switchMap(res => this.tokenService.setToken(res));
  }

  get(refresh = false) {
    return this.tokenService.getToken().switchMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      const stream$ = this.apiService.get('profile');
      return this.cacheService.from('service-profile', stream$, refresh).map(profile => {
        return dateFormatter.parseObj(profile);
      }).concat(this.profileUpdate$);
    });
  }

  save(model) {
    return this.apiService.post('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

  logout() {
    return this.storageService.set('notificationRegistred', false).switchMap(() => {
      return this.tokenService.clearToken();
    }).switchMap(() => {
      return this.cacheService.clear();
    });
  }

  appOpened() {
    return this.apiService.connection().filter(c => c).first().switchMap(() => {
      return this.storageService.get('notificationRegistred');
    }).switchMap(registered => {
      const data = { notificationUserId: registered ? null : this.notificationService.getUserId() };
      return this.apiService.post('profile/app-opened', data);
    }).switchMap(() => {
      return this.storageService.set('notificationRegistred', true);
    });
  }
}