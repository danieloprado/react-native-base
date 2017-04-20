import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Welcome from './pages/welcome';
import Home from './pages/home';

const appNavigator = StackNavigator({
  Welcome: { screen: Welcome },
  Home: { screen: Home }
}, { headerMode: 'none' });

AppRegistry.registerComponent('churchReact', () => appNavigator);