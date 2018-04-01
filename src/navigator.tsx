import { StackNavigator, TabNavigator } from 'react-navigation';

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
import MorePage from './pages/more';
import ProfileDetailsPage from './pages/profile/details';
import ProfileEditPage from './pages/profile/form';
import { theme } from './theme';

export const ROUTES_ROLES = [
  { display: 'Relátorio de Culto', icon: 'list-box', key: 'ChurchReport', roles: ['churchReport'] },
  { display: 'Dev Test', icon: 'hammer', key: 'Dev', roles: ['sysAdmin'] }
];

const tabNavigator = TabNavigator({
  Home: { screen: HomePage },
  Bible: { screen: BiblePage },
  Informative: { screen: InformativeListPage },
  Event: { screen: EventListPage },
  More: { screen: MorePage }
}, {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: theme.accent,
      pressColor: theme.accent,
      indicatorStyle: {
        backgroundColor: 'transparent'
      },
      inactiveTintColor: 'gray',
      ... (theme.platform === 'ios' ? {} :
        {
          tabStyle: {
            height: 60,
            elevation: 8
          },
          labelStyle: {
            fontSize: 10,
            width: 110
          },
          iconStyle: {
            marginTop: 10,
            width: 50,
            marginBottom: -5
          },
          style: {
            backgroundColor: 'white'
          },
        })
    }
  });

// tslint:disable-next-line:variable-name
const Navigator: any = StackNavigator({
  Index: { screen: IndexPage },
  Login: { screen: LoginPage },

  Home: { screen: tabNavigator },
  Bible: { screen: tabNavigator },
  Informative: { screen: tabNavigator },
  Event: { screen: tabNavigator },
  More: { screen: tabNavigator },

  Profile: { screen: ProfileDetailsPage },
  ProfileEdit: { screen: ProfileEditPage },
  InformativeDetails: { screen: InformativeDetailsPage },
  EventDetails: { screen: EventDetailsPage },
  ChurchReport: { screen: ChurchReportListPage },
  ChurchReportForm: { screen: ChurchReportFormPage },
  Church: { screen: ChurchPage },
  Dev: { screen: DevPage }
}, {
    headerMode: 'none',
    initialRouteName: 'Index',
  });

export default Navigator;