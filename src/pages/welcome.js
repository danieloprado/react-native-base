import React from 'react';
import { StyleSheet, Dimensions, Image, StatusBar } from 'react-native';
import { NavigationActions } from 'react-navigation';
import BaseComponent from '../components/base';
import theme from '../theme';
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

  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Event' })]
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    // setTimeout(() => this.navigateToHome());

    return (
      <Container>
        <Content>
          <View style={StyleSheet.flatten(styles.container)}>
            <StatusBar translucent={true}></StatusBar>  
            <Image source={require('../images/background.png')} style={styles.background}>
              <Image source={require('../images/logo.png')} style={styles.logo}/>
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
                <Button transparent onPress={() => this.navigateToHome()}>
                  <Text style={StyleSheet.flatten(styles.skipText)}>PULAR</Text>
                </Button>
              </View>
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
    flexWrap: 'wrap'
  },
  buttonFirst: {
    marginRight: 20
  },
  skipWrapper: {
    marginTop: 50
  },
  skipText: {
    color: 'white'
  }
});