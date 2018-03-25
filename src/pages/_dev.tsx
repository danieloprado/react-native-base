import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent } from '../components/base';
import { classes } from '../theme';

export default class DevPage extends BaseComponent {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Dev' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='hammer' style={{ color: tintColor }} />
    )
  };

  public testError(): void {
    throw new Error('Test');
  }

  public render(): JSX.Element {
    return (
      <Container style={classes.cardsContainer}>
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
          <View style={StyleSheet.flatten([classes.cardsPadding, classes.alignCenter])}>
            <Button onPress={() => this.testError()}>
              <Text>Test Error</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
