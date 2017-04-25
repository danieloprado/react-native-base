import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Navigator from './navigator';

class App extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Navigator />
      </StyleProvider>
    );
  }
}

AppRegistry.registerComponent('churchReact', () => App);