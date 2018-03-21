import './operators/bindComponent';
import './operators/cache';
import './operators/logError';
import 'rxjs/add/operator/map';

import { Root, StyleProvider } from 'native-base';
import * as React from 'react';
import { Component } from 'react';
import { AppRegistry, Keyboard } from 'react-native';
import { NavigationState } from 'react-navigation';
import { Subscription } from 'rxjs';

import { Loader } from './components/loader';
import { Navigator } from './navigator';
import * as loaderOperador from './operators/loader';
import getTheme from './theme/native-base/components';
import platform from './theme/native-base/variables/platform';
import tokenService from './services/token';
import logService from './services/log';
import notificationService from './services/notification';
import bibleDatabase from './database/bible';

interface IState {
  loading: boolean;
}

class App extends Component<any, IState> {
  private subscription: Subscription;
  private navigator: any;

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  public componentWillMount(): void {
    this.subscription = tokenService.getUser()
      .do(user => logService.setUser(user))
      .logError()
      .subscribe();

    bibleDatabase.listBooks()
      .logError()
      .subscribe(b => {
        console.log(b);
      }, err => console.error(err));
  }

  public componentWillUnmount(): void {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
  }

  public componentDidMount(): void {
    loaderOperador.setup(this.refs.loader as Loader);
    this.setState({ loading: false }, () => {
      notificationService.setup(this.navigator);
    });
  }

  public render(): JSX.Element {
    const { loading } = this.state;

    return (
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <Loader ref='loader' />
          {!loading &&
            <Navigator ref={(nav: any) => { this.navigator = nav; }} onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
          }
        </Root>
      </StyleProvider>
    );
  }

  private onNavigationStateChange(prevState: NavigationState, currentState: NavigationState): void {
    Keyboard.dismiss();

    if (!currentState || !currentState.routes || !currentState.routes.length || prevState === currentState) return;
    logService.breadcrumb(this.getCurrentRouteName(currentState), 'navigation');
  }

  private getCurrentRouteName(navigationState: NavigationState): string {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }

    return route.routeName;
  }

}

AppRegistry.registerComponent('churchReact', () => App);