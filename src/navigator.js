import { DrawerNavigator, StackNavigator } from 'react-navigation';

import ChurchPage from './pages/church';
import ChurchReportFormPage from './pages/church-report/form';
import ChurchReportListPage from './pages/church-report/list';
import DevPage from './pages/_dev';
import EventDetailsPage from './pages/event/details';
import EventListPage from './pages/event/list';
import HomePage from './pages/home';
import InformativeDetailsPage from './pages/informative/details';
import InformativeListPage from './pages/informative/list';
import ProfileDetails from './pages/profile/details';
import ProfileEditPage from './pages/profile/form';
import SideMenu from './components/sideMenu';
import WelcomePage from './pages/welcome';
import platform from '../native-base-theme/variables/platform';

const appDrawer = DrawerNavigator({
  Home: { screen: HomePage },
  Profile: { screen: ProfileDetails },
  Informative: { screen: InformativeListPage },
  Event: { screen: EventListPage },
  ChurchReport: { screen: ChurchReportListPage },
  Church: { screen: ChurchPage },
  Dev: { screen: DevPage },
}, {
    initialRouteName: 'Home',
    contentComponent: SideMenu,
    contentOptions: {
      inactiveTintColor: 'black',
      activeTintColor: platform.accent
    }
  });

export default StackNavigator({
  Welcome: { screen: WelcomePage },
  Home: { screen: appDrawer },
  Profile: { screen: appDrawer },
  ProfileEdit: { screen: ProfileEditPage },
  Informative: { screen: appDrawer },
  InformativeDetails: { screen: InformativeDetailsPage },
  Event: { screen: appDrawer },
  EventDetails: { screen: EventDetailsPage },
  ChurchReport: { screen: appDrawer },
  ChurchReportForm: { screen: ChurchReportFormPage },
  Church: { screen: appDrawer },
  Dev: { screen: appDrawer }
}, {
    headerMode: 'none',
    initialRouteName: 'Welcome',
  });