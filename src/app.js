import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Navigator from './navigator';
import OneSignal from 'react-native-onesignal';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', this.onReceived.bind(this));
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('registered', this.onRegistered.bind(this));
    OneSignal.addEventListener('ids', this.onIds.bind(this));
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  componentDidMount() {
    console.log(this.navigator);
  }


  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    this.navigator.dispatch({ type: 'Navigate', routeName: 'Informative' });
  }

  onRegistered(notifData) {
    console.log('Device had been registered for push notifications!', notifData);
  }

  onIds(device) {
    console.log('Device info: ', device);
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