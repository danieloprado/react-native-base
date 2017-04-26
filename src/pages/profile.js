import React from 'react';
import { StyleSheet } from 'react-native';
import { variables } from '../theme';
import BaseComponent from '../components/base';
import theme from '../theme';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  View,
  H2
} from 'native-base';

export default class ProfilePage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Perfil',
    drawerIcon: ({ tintColor }) => (
      <Icon name="contact" style={{ color: tintColor }} />
    )
  };

  render() {
    return (
      <Container style={StyleSheet.flatten(theme.cardsContainer)}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
              <Title>Perfil</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={StyleSheet.flatten(styles.header)}>
            <H2 style={StyleSheet.flatten(styles.headerText)}>Daniel</H2>
          </View>
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: variables.accent,
    padding: 16
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  content: {
    padding: 16
  }
});