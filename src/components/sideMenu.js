import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';

import BaseComponent from './base';
import DrawerItems from './drawerItems';
import React from 'react';
import { Text } from 'native-base';
import platform from '../../native-base-theme/variables/platform';
import tokenService from '../services/token';

const ROUTES_ROLES = [
  // { key: 'Church', roles: ['admin'] }
];

export default class SideMenu extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      routes: this.filterRoutes()
    };
  }

  filterRoutes(user) {
    if (!user) {
      return this.props.navigation.state.routes.filter(r => !ROUTES_ROLES.some(x => x.key === r.key));
    }

    return this.props.navigation.state.routes.filter(r => {
      const routeConfig = ROUTES_ROLES.filter(x => x.key === r.key)[0];
      return !routeConfig || user.canAccess(routeConfig.roles);
    });
  }

  componentWillMount() {
    this.subscription = tokenService.getUser().debounceTime(500).subscribe(user => {
      const routes = this.filterRoutes(user);
      this.setState({ routes });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { routes } = this.state;

    return (
      <View style={StyleSheet.flatten(styles.container)}>
        <View style={StyleSheet.flatten(styles.header)}>
          <Image source={require('../images/logo.png')} style={StyleSheet.flatten(styles.logo)} />
          <Text style={StyleSheet.flatten(styles.headerText)}>ICB Sorocaba</Text>
        </View>
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
    backgroundColor: platform.toolbarDefaultBg,
    // height: 200
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  logo: {
    height: 80,
    width: 80,
    marginRight: 20
  },
  headerText: {
    fontSize: 20,
    color: platform.toolbarTextColor
  }
});