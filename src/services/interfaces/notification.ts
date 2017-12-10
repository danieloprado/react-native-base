import { NavigationAction, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationDispatch } from 'react-navigation';
import { Observable } from 'rxjs/Rx';

export interface INotificationInfo<T = any> {
  action?: string;
  userId?: string;
  data?: T;
}

export interface INotificationHandler<T extends { [key: string]: string } = any> {
  (dispatch: NavigationDispatch<any>, info: INotificationInfo<T>, appStarted: boolean): Promise<void>;
}

export interface INotificationService {
  setup(navigator: NavigationScreenProp<NavigationRoute<any>, NavigationAction>): void;
  getToken(): Observable<string>;
  appDidOpen(): void;
  hasInitialNotification(): Observable<boolean>;
  onNotification(): Observable<{ action?: string, data?: any; }>;
  registerHandler(action: string, handler: INotificationHandler): void;
}
