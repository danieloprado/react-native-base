import * as React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import notificationService from '../services/notification';
import storageService from '../services/storage';
import { isDevelopment } from '../settings';
import BaseComponent from '../shared/abstract/baseComponent';

export default class IndexPage extends BaseComponent {

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
