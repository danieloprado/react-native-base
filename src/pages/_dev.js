import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import BaseComponent from '../components/base';
import { theme } from '../theme';

export default class DevPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Dev',
    drawerIcon: ({ tintColor }) => (
      <Icon name="hammer" style={{ color: tintColor }} />
    )
  };

  testError() {
    throw new Error('Test');
  }

  render() {
    return (
      <Container style={theme.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Dev Menu</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={StyleSheet.flatten([theme.cardsPadding, theme.alignCenter])}>
            <Button onPress={() => this.testError()}>
              <Text>Test Error</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
