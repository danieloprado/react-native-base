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
    drawerLabel: 'Informativos',
    drawerIcon: ({ tintColor }) => (
      <Icon name="paper" style={{ color: tintColor }} />
    )
  };

  openDrawer() {
    console.log('here');
    this.props.navigation.navigate('DrawerOpen');
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Wrapper>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
              <Title>Informativos</Title>
          </Body>
        </Header>
        <Content padder={true}>
          <Card>
            <CardItem header>
                <Text>Informative</Text>
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