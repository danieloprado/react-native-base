import React, { Component } from 'react';
import { Root, StyleProvider } from 'native-base';

import { AppRegistry } from 'react-native';
import Navigator from './navigator';
import { Observable } from 'rxjs/Observable';
import OneSignal from 'react-native-onesignal';
import getTheme from '../native-base-theme/components';
import logService from './services/log';
import notificationService from './services/notification';
import platform from '../native-base-theme/variables/platform';
import profileService from './services/profile';
import tokenService from './services/token';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));
    OneSignal.addEventListener('ids', this.onNotificationRegistred.bind(this));

    this.subscription = tokenService.getUser().switchMap(user => {
      logService.setUser(user);

      if (!user) {
        return Observable.of(null);
      }

      return profileService.appOpened();
    }).subscribe(() => { }, err => logService.handleError(err));
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

  onNavigationStateChange(prevState, currentState) {
    if (!currentState || !currentState.routes || !currentState.routes.length || prevState === currentState) return;
    logService.breadcrumb(this.getCurrentRouteName(currentState), 'navigation');
  }

  getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }

    return route.routeName;
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <Navigator ref={nav => { this.navigator = nav; }} onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
        </Root>
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => App);