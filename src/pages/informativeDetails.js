import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import theme from '../theme';
import Wrapper from '../theme/wrapper';
import { enInformativeType } from '../services/informative';
import {
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  Text
} from 'native-base';

export default class InformativeDetailsPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.informative = this.params.informative;
  }

  render() {
    return (
      <Wrapper>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
                <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>
              {this.informative.type === enInformativeType.cell ?
                'Célula' : 'Igreja'
              }
            </Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={StyleSheet.flatten(theme.contentWhite)}>
          <Text>Here</Text>          
        </Content>  
      </Wrapper>
    );
  }
}