import React, { Component } from 'react';
import Wrapper from '../theme/wrapper';
import {
  Content,
  Text,
  Header,
  Left,
  Body,
  Button,
  Title,
  Icon,
  Card,
  CardItem
} from 'native-base';

export default class HomePage extends Component {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Início',
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor }} />
    )
  };

  openDrawer() {
    this.props.navigation.navigate('DrawerOpen');
  }

  render() {
    return (
      <Wrapper>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
              <Title>ICB Sorocaba</Title>
          </Body>
        </Header>
        <Content padder={true}>
          <Card>
            <CardItem header>
                <Text>NativeBase</Text>
            </CardItem>
            <CardItem>
                <Body>
                    <Text>Body</Text>
                </Body>
            </CardItem>
            <CardItem header>
                <Text>GeekyAnts</Text>
            </CardItem>
          </Card>
        </Content>  
      </Wrapper>
    );
  }
}