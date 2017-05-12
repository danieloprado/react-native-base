import React, { Component } from 'react';

import { AppRegistry } from 'react-native';
import Navigator from './navigator';
import OneSignal from 'react-native-onesignal';
import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import notificationService from './services/notification';
import platform from '../native-base-theme/variables/platform';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));
    OneSignal.addEventListener('ids', this.onNotificationRegistred.bind(this));
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onNotificationOpened);
    OneSignal.removeEventListener('ids', this.onNotificationRegistred);
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
        <Navigator ref={nav => { this.navigator = nav; }} />
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => App);