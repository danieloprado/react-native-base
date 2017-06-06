import React, { Component } from 'react';

import { AppRegistry } from 'react-native';
import Navigator from './navigator';
import { Observable } from 'rxjs/Observable';
import OneSignal from 'react-native-onesignal';
import { StyleProvider } from 'native-base';
import codePush from 'react-native-code-push';
import getTheme from '../native-base-theme/components';
import notificationService from './services/notification';
import platform from '../native-base-theme/variables/platform';
import profileService from './services/profile';
import tokenService from './services/token';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));
    OneSignal.addEventListener('ids', this.onNotificationRegistred.bind(this));

    this.subscription = tokenService.getUser().switchMap(user => {
      if (!user) return Observable.of(null);
      return profileService.appOpened();
    }).subscribe();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onNotificationOpened);
    OneSignal.removeEventListener('ids', this.onNotificationRegistred);

    if (!this.subscription) return;
    this.subscription.unsubscribe();
  }

  onNotificationOpened(result) {
    notificationService.resolve(this.navigator, result.notification);
  }

  onNotificationRegistred({ userId }) {
    notificationService.setUserId(userId);
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Navigator ref={nav => { this.navigator = nav; }} onNavigationStateChange={null} />
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => codePush(App));