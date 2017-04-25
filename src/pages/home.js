import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import ChurchCard from '../components/churchCard';
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
  Icon
} from 'native-base';

export default class HomePage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Início',
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor }} />
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
              <Title>ICB Sorocaba</Title>
          </Body>
          <Right />
        </Header>
        <Content padder={true}>
          <ChurchCard></ChurchCard>
        </Content>  
      </Container>
    );
  }
}