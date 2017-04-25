import { StackNavigator, DrawerNavigator } from 'react-navigation';
import platform from '../native-base-theme/variables/platform';

import SideMenu from './components/sideMenu';
import Welcome from './pages/welcome';
import Home from './pages/home';
import Informative from './pages/informative';
import InformativeDetails from './pages/informativeDetails';
import Event from './pages/event';
import EventDetails from './pages/eventDetails';

const appDrawer = DrawerNavigator({
  Home: { screen: Home },
  Informative: { screen: Informative },
  Event: { screen: Event }
}, {
  contentComponent: SideMenu,
  contentOptions: {
    activeTintColor: platform.accent
  }
});

export default StackNavigator({
  Welcome: { screen: Welcome },
  Home: { screen: appDrawer },
  Informative: { screen: appDrawer },
  InformativeDetails: { screen: InformativeDetails },
  Event: { screen: appDrawer },
  EventDetails: { screen: EventDetails }
}, { headerMode: 'none' });