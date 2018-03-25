import SplashScreen from 'react-native-splash-screen';
import { NavigationScreenProp } from 'react-navigation';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { INotificationHandler, INotificationInfo } from '../interfaces/notification';
import { InteractionManager } from '../providers/interactionManager';
import firebaseService, { FirebaseService, INotificationInfoRemote } from './firebase';
import storageService, { StorageService } from './storage';
import tokenService, { TokenService } from './token';

export class NotificationService {
  private navigator: NavigationScreenProp<any>;

  private appDidOpen$: ReplaySubject<void>;
  private setup$: ReplaySubject<void>;
  private token$: ReplaySubject<string>;
  private hasInitialNotification$: ReplaySubject<boolean>;
  private newNotification$: Subject<INotificationInfo>;

  private handlers: { [key: string]: INotificationHandler } = {};

  constructor(
    private storageService: StorageService,
    private tokenService: TokenService,
    private firebaseService: FirebaseService
  ) {
    this.appDidOpen$ = new ReplaySubject(1);
    this.setup$ = new ReplaySubject(1);
    this.token$ = new ReplaySubject(1);
    this.newNotification$ = new Subject();
    this.hasInitialNotification$ = new ReplaySubject(1);

    this.firebaseService.onTokenRefresh()
      .logError()
      .subscribe(token => this.token$.next(token));

    this.firebaseService.onNewNotification()
      .logError()
      .switchMap(n => this.received(n.notification, n.initial))
      .subscribe();

    this.token$
      .distinctUntilChanged()
      .filter(t => !!t)
      .logError()
      .switchMap(t => this.storageService.set('notification-token', t))
      .subscribe();
  }

  public setup(navigator: NavigationScreenProp<any>): void {
    this.navigator = navigator;
    this.setup$.next(null);
    this.setup$.complete();
  }

  public getToken(): Observable<string> {
    return this.token$.sampleTime(500);
  }

  public appDidOpen(): void {
    this.appDidOpen$.next(null);
    this.appDidOpen$.complete();
  }

  public hasInitialNotification(): Observable<boolean> {
    return this.hasInitialNotification$.asObservable();
  }

  public onNotification(): Observable<{ action?: string, data?: any; }> {
    return this.newNotification$.asObservable();
  }

  public registerHandler(action: string, handler: INotificationHandler): void {
    this.handlers[action] = handler;
  }

  private received(notification: INotificationInfoRemote, appStarted: boolean = false): Observable<boolean> {
    return this.checkNotification(notification)
      .do(valid => {
        if (!appStarted) return;
        this.hasInitialNotification$.next(valid);
        this.hasInitialNotification$.complete();
      })
      .filter(valid => valid)
      .do(() => this.newNotification$.next(notification))
      .switchMap(() => {
        return notification.opened_from_tray || appStarted ?
          this.execNotification(notification, appStarted) :
          this.firebaseService.createLocalNotification(notification);
      })
      .do(() => SplashScreen.hide());
  }

  private checkNotification(notification: INotificationInfo): Observable<boolean> {
    if (!notification || !notification.action || !this.handlers[notification.action]) {
      return Observable.of(false);
    }

    if (!notification.userId) {
      return Observable.of(true);
    }

    return this.tokenService.getUser()
      .first()
      .map(user => {
        if (!user) return false;
        return Number(notification.userId) == user.id;
      });
  }

  private execNotification(notification: INotificationInfo, appStarted: boolean = false): Observable<boolean> {
    if (typeof notification.data === 'string') {
      notification.data = JSON.parse(notification.data);
    }

    return this.appDidOpen$
      .combineLatest(this.setup$)
      .switchMap(() => this.handlerNotification(notification, appStarted));
  }

  private handlerNotification(notification: INotificationInfo, appStarted: boolean): Observable<any> {
    return Observable
      .of(true)
      .switchMap(() => {
        const { dispatch } = this.navigator;

        const promise: any = InteractionManager.runAfterInteractions(() => {
          return this.handlers[notification.action](dispatch, notification, appStarted);
        });

        return Observable.fromPromise(promise);
      });
  }

}

const notificationService = new NotificationService(storageService, tokenService, firebaseService);
export default notificationService;