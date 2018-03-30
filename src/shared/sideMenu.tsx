import { Text } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { IChurch } from '../interfaces/church';
import { IUserToken } from '../interfaces/userToken';
import churchService from '../services/church';
import tokenService from '../services/token';
import { isiOS } from '../settings';
import BaseComponent from './abstract/baseComponent';
import { DrawerNavigatorItems as DrawerItems } from './drawerItems';

const ROUTES_ROLES = [
  { key: 'ChurchReport', roles: ['churchReport'] },
  { key: 'Dev', roles: ['sysAdmin'] }
];

interface IState {
  routes: any[];
  church?: IChurch;
}

export class SideMenu extends BaseComponent<IState, NavigationScreenProps> {

  constructor(props: any) {
    super(props);
    this.state = { routes: [], church: {} as any };
  }

  public filterRoutes(user: IUserToken): any {
    const routes: { key: string }[] = (this.props.navigation.state as any).routes;

    if (!user) {
      return routes.filter(r => !ROUTES_ROLES.some(x => x.key === r.key));
    }

    return routes.filter(r => {
      const routeConfig = ROUTES_ROLES.filter(x => x.key === r.key)[0];
      return !routeConfig || user.canAccess(...routeConfig.roles);
    });
  }

  public componentDidMount(): void {
    tokenService.getUser()
      .combineLatest(churchService.info())
      .logError()
      .bindComponent(this)
      .subscribe(([user, church]) => {
        const routes = this.filterRoutes(user);
        this.setState({ routes, church });
      });
  }

  public render(): JSX.Element {
    const { routes, church } = this.state;

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../images/background.png')} style={styles.header}>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <Text style={styles.headerText}>{church.name}</Text>
        </ImageBackground>
        <ScrollView>
          <DrawerItems {...this.props} routes={routes} />
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height
  },
  header: {
    alignItems: 'center',
    padding: 16,
    paddingTop: isiOS ? 26 : 0,
    justifyContent: 'center'
  },
  logo: {
    height: 100,
    width: 100
  },
  headerText: {
    fontSize: 20,
    color: 'white'
  }
});