import React, { Component } from 'react';
// import { StatusBar } from 'react-native';
import {
  Container,
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
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
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
      </Container>
    );
  }
}