import React, { Component } from 'react';
import { Root, StyleProvider } from 'native-base';

import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';
import Navigator from './navigator';
import { Observable } from 'rxjs/Observable';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import getTheme from '../native-base-theme/components';
import notificationService from './services/notification';
import platform from '../native-base-theme/variables/platform';
import profileService from './services/profile';
import tokenService from './services/token';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  constructor(props) {
    super(props);
    this.bugsnag = new Client();
  }

  componentWillMount() {

    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));
    OneSignal.addEventListener('ids', this.onNotificationRegistred.bind(this));

    this.subscription = tokenService.getUser().switchMap(user => {
      if (!user) {
        this.bugsnag.clearUser();
        return Observable.of(null);
      }

      this.bugsnag.setUser(user.id.toString(), user.fullName, user.email);
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

  onNavigationStateChange(data) {
    if (!data || !data.routes || !data.routes.length) return;
    this.bugsnag.leaveBreadcrumb(data.routes.pop().routeName, { type: 'navigation' });
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <Navigator ref={nav => { this.navigator = nav; }} onNavigationStateChange={data => this.onNavigationStateChange(data)} />
        </Root>
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => codePush(App));