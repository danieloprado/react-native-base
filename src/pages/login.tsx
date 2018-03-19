import { Button, Container, Icon, Text, View } from 'native-base';
import * as React from 'react';
import { Animated, Image, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { BaseComponent, IStateBase } from '../components/base';
import { alertError } from '../providers/alert';
import { isDevelopment } from '../settings';
import { theme, variables } from '../theme';
import storageService from '../services/storage';
import facebookService from '../services/facebook';
import googleService from '../services/google';
import profileService from '../services/profile';

interface IState extends IStateBase {
  loaded: boolean;
  animationHeight: Animated.Value;
  animationFade: Animated.Value;
  animationClass: any;
  animationContainer: any;
  force: boolean;
}

export default class LoginPage extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loaded: false,
      animationHeight: new Animated.Value(0),
      animationFade: new Animated.Value(0),
      animationClass: {},
      animationContainer: { opacity: 0 },
      force: (this.params || {}).force
    };
  }

  public navigateToHome(): void {
    if (this.state.force) {
      this.goBack();
      return;
    }

    if (isDevelopment) return this.navigate('Event', null, true);
    this.navigate('Home', null, true);
  }

  public completed(): void {
    storageService.set('welcomeCompleted', true)
      .logError()
      .bindComponent(this)
      .subscribe(() => this.navigateToHome());
  }

  public async viewLoaded(event: any): Promise<void> {
    if (this.state.loaded) {
      return;
    }

    this.setState({ loaded: true });
    const finalHeight = event.nativeEvent.layout.height;

    await this.setState({
      animationClass: {
        height: this.state.animationHeight,
        opacity: this.state.animationFade
      },
      animationContainer: { opacity: this.state.animationFade }
    });

    setTimeout(() => {
      Animated.timing(this.state.animationFade, { toValue: 1 }).start();
      Animated.timing(this.state.animationHeight, { toValue: finalHeight }).start();
    });
  }

  public loginSocial(provider: 'google' | 'facebook'): void {
    const providers = {
      'facebook': facebookService,
      'google': googleService
    };

    providers[provider].login()
      .filter(accessToken => !!accessToken)
      .switchMap(accessToken => profileService.register(provider, accessToken))
      .loader()
      .logError()
      .bindComponent(this)
      .subscribe(() => this.completed(), err => alertError(err).subscribe());
  }

  public render(): JSX.Element {
    const { animationClass, animationContainer } = this.state;

    return (
      <Container>
        <View style={styles.container}>
          <StatusBar backgroundColor='#000000'></StatusBar>
          <ImageBackground source={require('../images/background.png')} style={styles.background}>
            <Animated.View style={StyleSheet.flatten([animationContainer, styles.background])}>
              <Image source={require('../images/logo.png')} style={styles.logo} />
              <Animated.View
                onLayout={(event: any) => this.viewLoaded(event)}
                style={animationClass}>
                <Text style={styles.welcome}>
                  Olá!
              </Text>
                <Text style={styles.instructions}>
                  Gostaríamos de te conhecer
              </Text>
                <View style={styles.buttons}>
                  <Button
                    iconLeft
                    onPress={() => this.loginSocial('facebook')}
                    style={StyleSheet.flatten([theme.buttonFacebook, styles.buttonFirst])}>
                    <Icon name='logo-facebook' />
                    <Text>FACEBOOK</Text>
                  </Button>
                  <Button
                    iconLeft
                    onPress={() => this.loginSocial('google')}
                    style={theme.buttonGoogle}>
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
    height: variables.deviceHeight,
    width: variables.deviceWidth
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