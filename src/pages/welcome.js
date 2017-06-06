import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Animated, Image, InteractionManager, StatusBar, StyleSheet } from 'react-native';
import { Button, Container, Icon, Text, View } from 'native-base';

import BaseComponent from '../components/base';
import { GoogleSignin } from 'react-native-google-signin';
import Loader from '../components/loader';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import notificationService from '../services/notification';
import profileService from '../services/profile';
import settings from '../settings';
import storage from '../services/storage';
import theme from '../theme';
import toast from '../services/toast';

export default class WelcomPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false
  };

  constructor(props) {
    super(props);

    this.state = {
      animationHeight: new Animated.Value(0),
      animationFade: new Animated.Value(0),
      animationClass: {},
      force: (this.params || {}).force
    };
  }

  async componentDidMount() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: settings.googleApi.iosClientid,
        webClientId: settings.googleApi.webClientId,
        offlineAccess: true
      });
    } catch (err) {
      toast('Um erro aconteceu...');
    }
  }

  navigateToHome() {
    if (this.state.force) {
      this.goBack();
      return;
    }

    if (settings.isDevelopment) return this.navigate('Event', null, true);
    this.navigate('Home', null, true);
  }

  completed() {
    storage.set('welcomeCompleted', true).subscribe(() => {
      this.navigateToHome();
    });
  }

  viewLoaded(event) {
    if (this.state.loaded || this.state.force) {
      return;
    }

    const finalHeight = event.nativeEvent.layout.height;

    this.setState({ loaded: true });
    storage.get('welcomeCompleted').subscribe(completed => {
      notificationService.appDidOpen();

      if (completed) {
        this.navigateToHome();

        if (!notificationService.hasNotification()) {
          InteractionManager.runAfterInteractions(() => SplashScreen.hide());
        }
        return;
      }

      if (!notificationService.hasNotification()) {
        this.animate(finalHeight);
      }
    });
  }

  animate(finalHeight) {
    this.setState({
      animationClass: {
        height: this.state.animationHeight,
        opacity: this.state.animationFade
      }
    }).then(() => {
      SplashScreen.hide();
      setTimeout(() => {
        Animated.timing(this.state.animationFade, { toValue: 1 }).start();
        Animated.timing(this.state.animationHeight, { toValue: finalHeight }).start();
      }, 500);
    });
  }

  async loginFacebook() {
    const { isCancelled } = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
    if (isCancelled) return;

    const { accessToken } = await AccessToken.getCurrentAccessToken();
    this.register('facebook', accessToken);
  }

  async loginGoogle() {
    const { accessToken } = await GoogleSignin.signIn();
    this.register('google', accessToken);
  }

  register(provider, accessToken) {
    this.refs.loader.fromObservable(
      profileService.register(provider, accessToken)
    ).subscribe(() => {
      this.completed();
    }, () => {
      toast('Um erro aconteceu...');
    });
  }

  render() {
    return (
      <Container>
        <Loader ref="loader" />
        <View style={StyleSheet.flatten(styles.container)}>
          <StatusBar backgroundColor="#000000"></StatusBar>
          <Image source={require('../images/background.png')} style={styles.background}>
            <Image source={require('../images/logo.png')} style={styles.logo} />
            <Animated.View
              onLayout={event => this.viewLoaded(event)}
              style={this.state.animationClass}>
              <Text style={StyleSheet.flatten(styles.welcome)}>
                Olá!
              </Text>
              <Text style={StyleSheet.flatten(styles.instructions)}>
                Gostaríamos de te conhecer
              </Text>
              <View style={StyleSheet.flatten(styles.buttons)}>
                <Button onPress={() => this.loginFacebook()} iconLeft style={StyleSheet.flatten([theme.buttonFacebook, styles.buttonFirst])}>
                  <Icon name='logo-facebook' />
                  <Text>FACEBOOK</Text>
                </Button>
                <Button onPress={() => this.loginGoogle()} iconLeft style={StyleSheet.flatten(theme.buttonGoogle)}>
                  <Icon name='logo-google' />
                  <Text>GOOGLE</Text>
                </Button>
              </View>
              <View style={StyleSheet.flatten(styles.skipWrapper)}>
                <Button block transparent onPress={() => this.completed()}>
                  <Text style={StyleSheet.flatten(styles.skipText)}>PULAR</Text>
                </Button>
              </View>
            </Animated.View>
          </Image>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
    backgroundColor: 'transparent'
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent'
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonFirst: {
    marginRight: 20
  },
  skipWrapper: {
    marginTop: 50,
  },
  skipText: {
    color: 'white'
  }
});