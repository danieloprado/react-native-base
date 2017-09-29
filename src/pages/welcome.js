import { Button, Container, Icon, Text, View } from 'native-base';
import React from 'react';
import { Animated, Image, ImageBackground, InteractionManager, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import BaseComponent from '../components/base';
import services from '../services';
import { theme } from '../theme';

export default class WelcomPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false
  };

  constructor(props) {
    super(props);

    this.settings = services.get('settings');
    this.storage = services.get('storage');
    this.notificationService = services.get('notificationService');
    this.profileService = services.get('profileService');
    this.facebookService = services.get('facebookService');
    this.googleService = services.get('googleService');

    this.state = {
      animationHeight: new Animated.Value(0),
      animationFade: new Animated.Value(0),
      animationClass: {},
      force: (this.params || {}).force
    };
  }

  navigateToHome() {
    if (this.state.force) {
      this.goBack();
      return;
    }

    if (this.settings.isDevelopment) return this.navigate('Profile', null, true);
    this.navigate('Home', null, true);
  }

  completed() {
    this.storage.set('welcomeCompleted', true)
      .logError()
      .bindComponent(this)
      .subscribe(() => this.navigateToHome());
  }

  viewLoaded(event) {
    if (this.state.loaded || this.state.force) {
      return;
    }

    const finalHeight = event.nativeEvent.layout.height;

    this.setState({ loaded: true });
    this.storage.get('welcomeCompleted')
      .logError()
      .bindComponent(this)
      .subscribe(completed => {
        this.notificationService.appDidOpen();

        if (completed) {
          this.navigateToHome();

          if (!this.notificationService.hasNotification()) {
            InteractionManager.runAfterInteractions(() => SplashScreen.hide());
          }
          return;
        }

        if (!this.notificationService.hasNotification()) {
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

  loginSocial(provider) {
    const providers = {
      'facebook': this.facebookService,
      'google': this.googleService
    };

    providers[provider].login()
      .filter(accessToken => accessToken)
      .switchMap(accessToken => this.profileService.register(provider, accessToken))
      .loader()
      .logError()
      .bindComponent(this)
      .subscribe(() => this.completed());
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <StatusBar backgroundColor="#000000"></StatusBar>
          <ImageBackground source={require('../images/background.png')} style={styles.background}>
            <Image source={require('../images/logo.png')} style={styles.logo} />
            <Animated.View
              onLayout={event => this.viewLoaded(event)}
              style={this.state.animationClass}>
              <Text style={styles.welcome}>
                Olá!
              </Text>
              <Text style={styles.instructions}>
                Gostaríamos de te conhecer
              </Text>
              <View style={styles.buttons}>
                <Button onPress={() => this.loginSocial('faceobok')} iconLeft style={StyleSheet.flatten([theme.buttonFacebook, styles.buttonFirst])}>
                  <Icon name='logo-facebook' />
                  <Text>FACEBOOK</Text>
                </Button>
                <Button onPress={() => this.loginSocial('faceobok')} iconLeft style={StyleSheet.flatten(theme.buttonGoogle)}>
                  <Icon name='logo-google' />
                  <Text>GOOGLE</Text>
                </Button>
              </View>
              <View style={styles.skipWrapper}>
                <Button block transparent onPress={() => this.completed()}>
                  <Text style={styles.skipText}>PULAR</Text>
                </Button>
              </View>
            </Animated.View>
          </ImageBackground>
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