import React, { Component } from 'react';
import Wrapper from '../theme/wrapper';
import ChurchCard from '../components/churchCard';
import {
  Content,
  Header,
  Left,
  Body,
  Button,
  Title,
  Icon
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
          <ChurchCard></ChurchCard>
        </Content>  
      </Wrapper>
    );
  }
}