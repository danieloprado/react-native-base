import React, { Component } from 'react';
import { StyleSheet, Dimensions, Image, StatusBar, TouchableNativeFeedback } from 'react-native';
import { Content, Text, View, Button, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Wrapper from '../theme/wrapper';
import theme from '../theme';

export default class WelcomPage extends Component {
  static navigationOptions = {
    headerVisible: false
  };

  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })]
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    setTimeout(() => this.navigateToHome());

    return (
      <Wrapper>
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
                <TouchableNativeFeedback>
                  <Button onPress={() => this.navigateToHome()} iconLeft style={StyleSheet.flatten([theme.buttonFacebook, styles.buttonFirst])}>
                    <Icon name='logo-facebook' />  
                    <Text>Facebook</Text>
                  </Button>
                </TouchableNativeFeedback>  
                <TouchableNativeFeedback>
                  <Button iconLeft style={StyleSheet.flatten(theme.buttonGoogle)}>
                    <Icon name='logo-google' />  
                    <Text>Google</Text>                  
                  </Button>
                </TouchableNativeFeedback>  
              </View>
              <Text onPress={() => this.navigateToHome()} style={StyleSheet.flatten( styles.skip )}>Pular</Text>
            </Image>  
          </View>    
        </Content>  
      </Wrapper>
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
  skip: {
    color: 'white',
    marginTop: 100
  }
});