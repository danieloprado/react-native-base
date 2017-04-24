import { AppRegistry } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import platform from '../native-base-theme/variables/platform';

import SideMenu from './components/sideMenu';
import Welcome from './pages/welcome';
import Home from './pages/home';
import Informative from './pages/informative';
import InformativeDetails from './pages/informativeDetails';

const appDrawer = DrawerNavigator({
  Home: { screen: Home },
  Informative: { screen: Informative }
}, {
  contentComponent: SideMenu,
  contentOptions: {
    activeTintColor: platform.accent
  }
});

const appNavigator = StackNavigator({
  Welcome: { screen: Welcome },
  Home: { screen: appDrawer },
  Informative: { screen: appDrawer },
  InformativeDetails: { screen: InformativeDetails },
}, { headerMode: 'none' });

AppRegistry.registerComponent('churchReact', () => appNavigator);