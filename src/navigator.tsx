import { StackNavigator } from 'react-navigation';

import IndexPage from './pages';
import ProfileEditPage from './pages/profile/form';

export const ROUTES_ROLES = [
  { display: 'Relátorio de Culto', icon: 'list-box', key: 'ChurchReport', roles: ['churchReport'] },
  { display: 'Dev Test', icon: 'hammer', key: 'Dev', roles: ['sysAdmin'] }
];

// tslint:disable-next-line:variable-name
const Navigator: any = StackNavigator({
  Index: { screen: IndexPage },
  Form: { screen: ProfileEditPage },
}, {
    headerMode: 'none',
    initialRouteName: 'Index',
  });

export default Navigator;