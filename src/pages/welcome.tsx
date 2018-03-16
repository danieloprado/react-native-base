import * as React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent } from '../components/base';
import * as services from '../services';
import { NotificationService } from '../services/models/notification';
import { StorageService } from '../services/models/storage';
import { isDevelopment } from '../settings';

export default class WelcomPage extends BaseComponent {
  private storageService: StorageService;
  private notificationService: NotificationService;

  constructor(props: any) {
    super(props);

    this.storageService = services.get('storageService');
    this.notificationService = services.get('notificationService');
  }

  public componentWillMount(): void {
    this.notificationService.appDidOpen();

    this.notificationService.hasInitialNotification()
      .first()
      .filter(hasNotification => !hasNotification)
      .switchMap(() => this.storageService.get<boolean>('welcomeCompleted'))
      .map(welcomeCompleted => {
        setTimeout(() => SplashScreen.hide());

        return isDevelopment ?
          this.navigate('Event') :
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
