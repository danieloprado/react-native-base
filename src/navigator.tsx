import { DrawerNavigator, StackNavigator } from 'react-navigation';

import IndexPage from './pages';
import DevPage from './pages/_dev';
import BiblePage from './pages/bible';
import ChurchPage from './pages/church';
import ChurchReportFormPage from './pages/church-report/form';
import ChurchReportListPage from './pages/church-report/list';
import EventDetailsPage from './pages/event/details';
import EventListPage from './pages/event/list';
import HomePage from './pages/home';
import InformativeDetailsPage from './pages/informative/details';
import InformativeListPage from './pages/informative/list';
import LoginPage from './pages/login';
import ProfileDetailsPage from './pages/profile/details';
import ProfileEditPage from './pages/profile/form';
import { SideMenu } from './shared/sideMenu';
import { theme } from './theme';

const appDrawer = DrawerNavigator({
  Home: { screen: HomePage },
  Bible: { screen: BiblePage },
  Profile: { screen: ProfileDetailsPage },
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
      activeTintColor: theme.accent
    }
  });

// tslint:disable-next-line:variable-name
 const Navigator: any = StackNavigator({
  Index: { screen: IndexPage },
  Login: { screen: LoginPage },
  Home: { screen: appDrawer },
  Bible: { screen: appDrawer },
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
    initialRouteName: 'Index',
   });

export default Navigator;