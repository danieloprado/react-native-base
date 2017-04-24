import React from 'react';
import BaseComponent from '../components/base';
import Wrapper from '../theme/wrapper';
import ChurchCard from '../components/churchCard';
import {
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
          <Right />
        </Header>
        <Content padder={true}>
          <ChurchCard></ChurchCard>
        </Content>  
      </Wrapper>
    );
  }
}