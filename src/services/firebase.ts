import { ReplaySubject, Observable } from 'rxjs';
import FCM, { FCMEvent } from 'react-native-fcm';
import { INotificationInfo } from '../interfaces/notification';
import { Platform } from 'react-native';

export class FirebaseService {
  private lastId: string;
  private token$: ReplaySubject<string>;
  private notification$: ReplaySubject<{ notification: INotificationInfoRemote, initial: boolean }>;

  constructor() {
    this.token$ = new ReplaySubject(1);
    this.notification$ = new ReplaySubject(1);

    FCM.requestPermissions().then(() => { }, () => { });

    FCM.on(FCMEvent.RefreshToken, token => this.token$.next(token));
    FCM.getFCMToken().then(token => this.token$.next(token));

    FCM.on(FCMEvent.Notification, this.notificationCallback(false));
    FCM.getInitialNotification().then(this.notificationCallback(true));

    this.token$
      .map(() => FCM.subscribeToTopic('all'))
      .logError()
      .subscribe();
  }

  public onTokenRefresh(): Observable<string> {
    return this.token$.asObservable();
  }

  public onNewNotification(): Observable<{ notification: INotificationInfoRemote, initial: boolean }> {
    return this.notification$.asObservable();
  }

  public createLocalNotification(notification: INotificationInfoRemote): Observable<boolean> {
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

  private notificationCallback(initial: boolean): any {
    return (notification: INotificationInfoRemote) => {
      if (!notification && initial) {
        this.notification$.next(null);
        return;
      }

      const id: string = notification['gcm.message_id'] || notification['google.message_id'];
      if (id && this.lastId === id) return;

      this.lastId = id;
      this.notification$.next({ notification, initial });
    };
  }
}

export interface INotificationInfoRemote extends Notification, INotificationInfo {
  aps?: {
    alert: string | { title: string; body: string; }
  };

  [key: string]: any;
}

const firebaseService = new FirebaseService();
export default firebaseService;
