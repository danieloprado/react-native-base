import React from 'react';
import { StyleSheet, Dimensions, Image, StatusBar, Animated } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import BaseComponent from '../components/base';
import theme from '../theme';
import storage from '../services/storage';
import {
  Container,
  Content,
  Text,
  View,
  Button,
  Icon
} from 'native-base';

export default class WelcomPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false
  };

  constructor(props) {
    super(props);

    this.state = {
      animationHeight: new Animated.Value(0),
      animationFade: new Animated.Value(0),
      animationClass: {}
    };
  }

  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Profile' })]
    });

    this.props.navigation.dispatch(resetAction);
  }

  completed() {
    storage.set('welcomeCompleted', true).subscribe(() => {
      this.navigateToHome();
    });
  }

  viewLoaded(event) {
    if (this.state.loaded) return;
    const finalHeight = event.nativeEvent.layout.height;

    this.setState({
      loaded: true,
      animationClass: {
        height: this.state.animationHeight,
        opacity: this.state.animationFade
      }
    }).then(() => {
      storage.get('welcomeCompleted').subscribe(completed => {
        if (completed) {
          this.navigateToHome();
          SplashScreen.hide();
          return;
        }

        SplashScreen.hide();
        this.animate(finalHeight);
      });
    });
  }

  animate(finalHeight) {
    setTimeout(() => {
      Animated.timing(this.state.animationFade, { toValue: 1 }).start();
      Animated.timing(this.state.animationHeight, { toValue: finalHeight }).start();
    }, 500);
  }

  render() {
    // setTimeout(() => this.navigateToHome());

    return (
      <Container>
        <Content>
          <View style={StyleSheet.flatten(styles.container)}>
            <StatusBar backgroundColor="#000000"></StatusBar>  
            <Image source={require('../images/background.png')} style={styles.background}>
              <Image source={require('../images/logo.png')} style={styles.logo}/>
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
                  <Button onPress={() => this.navigateToHome()} iconLeft style={StyleSheet.flatten([theme.buttonFacebook, styles.buttonFirst])}>
                    <Icon name='logo-facebook' />  
                    <Text>FACEBOOK</Text>
                  </Button>
                  <Button iconLeft style={StyleSheet.flatten(theme.buttonGoogle)}>
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
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white'
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
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