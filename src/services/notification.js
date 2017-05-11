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
    this.userId = null;
    this.hasNotification = false;
    this.appDidOpened = new BehaviorSubject(false);
  }

  setUserId(userId) {
    this.userId = userId;
  }

  appDidOpen() {
    this.appDidOpen.next(true);
  }

  hasNotification() {
    return this.hasNotification;
  }

  resolve(navigator, notification) {
    this.hasNotification = true;

    const { dispatch } = navigator;
    const data = notification.payload.additionalData;
    if (!data || !ACTION_HANDLERS[data.action]) return Promise.resolve();

    const subscription = this.appDidOpen.subscribe(opened => {
      if (!opened) return;
      subscription.unsubscribe();

      return InteractionManager.runAfterInteractions(() => {
        return ACTION_HANDLERS[data.action](dispatch, data);
      }).then(() => {
        this.hasNotification = false;
        SplashScreen.hide();
      });
    });

  }

}

export default new NotificationService();