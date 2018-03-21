import * as React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent } from '../components/base';
import notificationService from '../services/notification';
import storageService from '../services/storage';
import { isDevelopment } from '../settings';

export default class WelcomPage extends BaseComponent {

  public componentWillMount(): void {
    notificationService.appDidOpen();

    notificationService.hasInitialNotification()
      .first()
      .filter(hasNotification => !hasNotification)
      .switchMap(() => storageService.get<boolean>('welcomeCompleted'))
      .map(welcomeCompleted => {
        setTimeout(() => SplashScreen.hide(), 500);

        return isDevelopment ?
          this.navigate('Bible', true) :
          this.navigate(welcomeCompleted ? 'Home' : 'Login', true);
      })
      .logError()
      .bindComponent(this)
      .subscribe();
  }

  public render(): JSX.Element {
    return (<View></View>);
  }
}
