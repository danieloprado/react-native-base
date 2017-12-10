import device from 'react-native-device-info';
import { Observable, Subject } from 'rxjs';

import { dateFormatter } from '../../formatters/date';
import { IUser } from '../../interfaces/user';
import { IUserToken } from '../../interfaces/userToken';
import { ApiService } from './api';
import { CacheService } from './cache';
import { NotificationService } from './notification';
import { TokenService } from './token';

export class ProfileService {
  private profileUpdate$: Subject<IUser>;

  constructor(
    private churchSlug: string,
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

  public register(provider: string, accessToken: string): Observable<void> {
    return this.notificationService.getToken()
      .first()
      .switchMap(notificationToken => {
        return this.apiService.post('register', {
          deviceId: device.getUniqueID(),
          name: `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`,
          application: this.churchSlug,
          provider,
          accessToken,
          notificationToken
        });
      })
      .switchMap(res => this.tokenService.setToken(res));
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
      .post('profile/logout', { deviceId: device.getUniqueID(), application: this.churchSlug })
      .switchMap(() => this.tokenService.clearToken())
      .switchMap(() => this.cacheService.clear());
  }

  private updateNotificationToken(notificationToken: string): Observable<void> {
    const deviceId = device.getUniqueID();
    const deviceName = `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;
    const application = this.churchSlug;

    return this.apiService.post('profile/notification-token', { deviceId, application, notificationToken, deviceName });
  }

}