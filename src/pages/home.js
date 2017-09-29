import { Body, Button, Container, Content, Header, Icon, Left, Right, Title, View } from 'native-base';
import React from 'react';

import BaseComponent from '../components/base';
import ChurchCard from '../components/churchCard';
import EventCard from '../components/eventCard';
import InformativeCard from '../components/informativeCard';
import { theme } from '../theme';

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
      <Container style={theme.cardsContainer}>
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
        <Content>
          <View style={theme.cardsPadding}>
            <ChurchCard navigation={this.props.navigation}></ChurchCard>
            <InformativeCard navigation={this.props.navigation}></InformativeCard>
            <EventCard navigation={this.props.navigation}></EventCard>
          </View>
        </Content>
      </Container>
    );
  }
}
