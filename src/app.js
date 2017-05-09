import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Navigator from './navigator';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';

console.ignoredYellowBox = ['Warning: BackAndroid'];

class App extends Component {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('ids', this.onIds.bind(this));
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.navigator.dispatch({
    //     type: 'Navigation/NAVIGATE',
    //     routeName: 'InformativeDetails',
    //     params: { id: 54 }
    //   });
    // }, 1000);
  }

  onOpened(result) {
    const data = result.notification.payload.additionalData;
    if (!data) return;

    SplashScreen.hide();
    this.navigator.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'InformativeDetails',
      params: { id: 54 }
    });
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