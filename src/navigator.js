import { StackNavigator, DrawerNavigator } from 'react-navigation';
import platform from '../native-base-theme/variables/platform';

import SideMenu from './components/sideMenu';
import Welcome from './pages/welcome';
import Home from './pages/home';
import Church from './pages//church';
import Profile from './pages/profile';
import ProfileEdit from './pages/profileEdit';
import Informative from './pages/informative';
import InformativeDetails from './pages/informativeDetails';
import Event from './pages/event';
import EventDetails from './pages/eventDetails';

const appDrawer = DrawerNavigator({
  Home: { screen: Home },
  Profile: { screen: Profile },
  Informative: { screen: Informative },
  Event: { screen: Event },
  Church: { screen: Church }
}, {
  contentComponent: SideMenu,
  contentOptions: {
    inactiveTintColor: 'black',
    activeTintColor: platform.accent
  }
});

export default StackNavigator({
  Welcome: { screen: Welcome },
  Home: { screen: appDrawer },
  Profile: { screen: appDrawer },
  ProfileEdit: { screen: ProfileEdit },
  Informative: { screen: appDrawer },
  InformativeDetails: { screen: InformativeDetails },
  Event: { screen: appDrawer },
  EventDetails: { screen: EventDetails },
  Church: { screen: appDrawer },
}, { headerMode: 'none' });