import { Platform } from 'react-native';
import FCM, { FCMEvent, Notification } from 'react-native-fcm';
import SplashScreen from 'react-native-splash-screen';
import { NavigationScreenProp } from 'react-navigation';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs/Rx';

import { INotificationHandler, INotificationInfo } from '../../interfaces/notification';
import { InteractionManager } from '../../providers/interactionManager';
import { StorageService } from './storage';
import { TokenService } from './token';

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
    private tokenService: TokenService
  ) {
    this.appDidOpen$ = new ReplaySubject(1);
    this.setup$ = new ReplaySubject(1);
    this.token$ = new ReplaySubject(1);
    this.newNotification$ = new Subject();

    this.hasInitialNotification$ = new ReplaySubject(1);
    FCM.on(FCMEvent.RefreshToken, token => this.setToken(token));

    let lastId: string;
    const notificationCallback = (initial: boolean) => {
      return (notif: INotificationInfoRemote) => {
        if (notif) {
          const id: string = notif['gcm.message_id'] || notif['google.message_id'];
          if (id && lastId === id) return;

          lastId = id;
        }

        this.received(notif, initial)
          .logError()
          .subscribe(() => { }, () => { });
      };
    };

    FCM.on(FCMEvent.Notification, notificationCallback(false));
    FCM.getInitialNotification().then(notificationCallback(true));

    this.token$
      .distinctUntilChanged()
      .do(() => FCM.subscribeToTopic('all'))
      .filter(t => !!t)
      .logError()
      .switchMap(t => storageService.set('notification-token', t))
      .subscribe();
  }

  public setup(navigator: NavigationScreenProp<any>): void {
    this.navigator = navigator;
    FCM.requestPermissions().then(() => { }, () => { });

    Observable.fromPromise(FCM.getFCMToken())
      .switchMap(token => {
        if (token) return Observable.of(token);
        return this.storageService.get<string>('notification-token');
      })
      .logError()
      .subscribe(token => this.setToken(token));

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

  private setToken(token: string): void {
    this.token$.next(token);
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
          this.buildLocalNotification(notification);
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

  private buildLocalNotification(notification: INotificationInfoRemote): Observable<boolean> {
    let data: any = {};

    switch (Platform.OS) {
      case 'ios':
        if (!notification.aps) return Observable.of(false);

        if (typeof (notification.aps || { alert: '' }).alert === 'string') {
          data = { body: notification.aps.alert };
          break;
        }

        data = notification.aps.alert;
        break;
      case 'android':
        data = notification.fcm;
        break;
    }

    FCM.presentLocalNotification({
      title: data.title,
      body: data.body,
      icon: data.icon,
      color: data.color,
      action: notification.action,
      data: notification.data,
      show_in_foreground: true
    } as any);

    return Observable.of(true);
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

export interface INotificationInfoRemote extends Notification, INotificationInfo {
  aps?: {
    alert: string | { title: string; body: string; }
  };

  [key: string]: any;
}