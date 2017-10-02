import './operators/bindComponent';
import './operators/cache';
import './operators/logError';
import 'rxjs/add/operator/map';

import { Root, StyleProvider } from 'native-base';
import { Component } from 'react';
import React from 'react';
import { AppRegistry, Keyboard } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { Observable } from 'rxjs/Observable';

import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Loader from './components/loader';
import Navigator from './navigator';
import loaderOperador from './operators/loader';
import services from './services';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  constructor(props) {
    super(props);

    this.settings = services.get('settings');
    this.tokenService = services.get('tokenService');
    this.notificationService = services.get('notificationService');
    this.profileService = services.get('profileService');
    this.logService = services.get('logService');

    this.state = { loading: true };
  }

  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));
    OneSignal.addEventListener('ids', this.onNotificationRegistred.bind(this));

    this.subscription = this.tokenService.getUser().switchMap(user => {
      this.logService.setUser(user);

      // if (!user) {
      return Observable.of(null);
      // }

      // return this.profileService.appOpened();
    }).subscribe(() => { }, err => this.logService.handleError(err));
  }

  componentDidMount() {
    loaderOperador(this.refs.loader);
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onNotificationOpened);
    OneSignal.removeEventListener('ids', this.onNotificationRegistred);

    if (!this.subscription) return;
    this.subscription.unsubscribe();
  }

  onNotificationOpened(result) {
    this.notificationService.resolve(this.navigator, result.notification);
  }

  onNotificationRegistred({ userId }) {
    this.notificationService.setUserId(userId);
  }

  onNavigationStateChange(prevState, currentState) {
    Keyboard.dismiss();

    if (!currentState || !currentState.routes || !currentState.routes.length || prevState === currentState) return;
    this.logService.breadcrumb(this.getCurrentRouteName(currentState), 'navigation');
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
    const { loading } = this.state;

    return (
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <Loader ref="loader" />
          {!loading &&
            <Navigator ref={nav => { this.navigator = nav; }} onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
          }
        </Root>
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => App);