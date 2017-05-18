import { DrawerNavigator, StackNavigator } from 'react-navigation';

import Church from './pages/church';
import ChurchReport from './pages/churchReport';
import Event from './pages/event';
import EventDetails from './pages/eventDetails';
import Home from './pages/home';
import Informative from './pages/informative';
import InformativeDetails from './pages/informativeDetails';
import Profile from './pages/profile';
import ProfileEdit from './pages/profileEdit';
import SideMenu from './components/sideMenu';
import Welcome from './pages/welcome';
import platform from '../native-base-theme/variables/platform';

const appDrawer = DrawerNavigator({
  Home: { screen: Home },
  Profile: { screen: Profile },
  Informative: { screen: Informative },
  Event: { screen: Event },
  // ChurchReport: { screen: ChurchReport },
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
  ChurchReport: { screen: appDrawer },
  Church: { screen: appDrawer },
}, { headerMode: 'none' });