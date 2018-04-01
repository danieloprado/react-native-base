import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import BaseComponent from '../shared/abstract/baseComponent';
import { classes } from '../theme';

export default class DevPage extends BaseComponent {
  public testError(): void {
    throw new Error('Test');
  }

  public render(): JSX.Element {
    return (
      <Container style={classes.cardsContainer}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.navigateBack()}>
              <Icon name='arrow-back' />
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
