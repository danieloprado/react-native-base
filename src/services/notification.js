import { InteractionManager } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { BehaviorSubject } from 'rxjs';

const ACTION_HANDLERS = {
  'new-informative': async(dispatch, data) => {
    dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'InformativeDetails',
      params: { id: data.id }
    });
  }
};

class NotificationService {

  constructor() {
    this._userId = null;
    this._hasNotification = false;
    this._appDidOpen$ = new BehaviorSubject(false);
  }

  setUserId(userId) {
    this._userId = userId;
  }

  getUserId() {
    return this._userId;
  }

  appDidOpen() {
    this._appDidOpen$.next(true);
  }

  hasNotification() {
    return this._hasNotification;
  }

  resolve(navigator, notification) {
    this._hasNotification = true;

    const { dispatch } = navigator;
    const data = notification.payload.additionalData;
    if (!data || !ACTION_HANDLERS[data.action]) return Promise.resolve();

    const subscription = this._appDidOpen$.subscribe(opened => {
      if (!opened) return;
      subscription.unsubscribe();

      return InteractionManager.runAfterInteractions(() => {
        return ACTION_HANDLERS[data.action](dispatch, data);
      }).then(() => {
        this._hasNotification = false;
        SplashScreen.hide();
      });
    });

  }

}

export default new NotificationService();