import device from 'react-native-device-info';
import { Observable, Subject } from 'rxjs';

import { dateFormatter } from '../formatters/date';
import { IUser } from '../interfaces/user';
import { IUserToken } from '../interfaces/userToken';
import apiService, { ApiService } from './api';
import cacheService, { CacheService } from './cache';
import notificationService, { NotificationService } from './notification';
import tokenService, { TokenService } from './token';

export class ProfileService {
  private profileUpdate$: Subject<IUser>;

  constructor(
    private apiService: ApiService,
    private cacheService: CacheService,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {
    this.profileUpdate$ = new Subject();

    this.notificationService.getToken()
      .distinctUntilChanged()
      .switchMap(token => this.apiService.connection()
        .filter(c => c)
        .first()
        .map(() => token))
      .combineLatest(this.isLogged())
      .filter(([token, isLogged]) => isLogged)
      .map(([token]) => token)
      .filter(token => !!token)
      .switchMap(token => this.updateNotificationToken(token))
      .logError()
      .subscribe();
  }

  public get(refresh?: boolean): Observable<IUser> {
    return this.tokenService.getToken().switchMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      return this.apiService.get<IUser>('profile')
        .cache('service-profile', { refresh })
        .map(profile => {
          return dateFormatter.parseObj(profile);
        }).concat(this.profileUpdate$);
    });
  }

  public save(model: IUser): Observable<IUser> {
    return this.apiService.post<IUser>('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

  public isLogged(): Observable<boolean> {
    return this.userChanged().map(t => !!t);
  }

  public userChanged(): Observable<IUserToken> {
    return this.tokenService.getUser()
      .distinctUntilChanged((n, o) => (n || { id: null }).id === (o || { id: null }).id);
  }

  public logout(): Observable<void> {
    return this.apiService
      .post('profile/logout', { deviceId: device.getUniqueID(), application: '%APP_ID%' })
      .switchMap(() => this.tokenService.clearToken())
      .switchMap(() => this.cacheService.clear());
  }

  private updateNotificationToken(notificationToken: string): Observable<void> {
    const deviceId = device.getUniqueID();
    const deviceName = `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;
    const application = '%APP_ID%';

    return this.apiService.post('profile/notification-token', { deviceId, application, notificationToken, deviceName });
  }

}

const profileService = new ProfileService(apiService, cacheService, notificationService, tokenService);
export default profileService;