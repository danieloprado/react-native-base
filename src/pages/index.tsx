import * as React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent } from '../components/base';
import { isDevelopment } from '../settings';
import notificationService from '../services/notification';
import storageService from '../services/storage';

export default class WelcomPage extends BaseComponent {

  public componentWillMount(): void {
    notificationService.appDidOpen();

    notificationService.hasInitialNotification()
      .first()
      .filter(hasNotification => !hasNotification)
      .switchMap(() => storageService.get<boolean>('welcomeCompleted'))
      .map(welcomeCompleted => {
        setTimeout(() => SplashScreen.hide());

        return isDevelopment ?
          this.navigate('Event', true) :
          this.navigate(welcomeCompleted ? 'Home' : 'Home', true);
      })
      .logError()
      .bindComponent(this)
      .subscribe();
  }

  public render(): JSX.Element {
    return (<View></View>);
  }
}
