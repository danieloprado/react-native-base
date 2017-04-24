import React from 'react';
import { WebView, Share } from 'react-native';
import BaseComponent from '../components/base';
import Wrapper from '../theme/wrapper';
import { enInformativeType } from '../services/informative';
import informativeRender from '../formatters/informativeRender';
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

export default class InformativeDetailsPage extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      informative: this.params.informative,
      html: informativeRender(this.params.informative)
    };
  }

  share() {
    Share.share({
      title: this.state.informative.title,
      message: this.state.text
    });
  }

  setText(text) {
    this.state.text = text;
    this.setState(this.state);
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
              {this.state.informative.type === enInformativeType.cell ?
                'Célula' : 'Igreja'
              }
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.share()}>
                <Icon name='share' />
            </Button>  
          </Right>  
        </Header>
        <Content>
          <WebView
            source={{ html: this.state.html }}
            onMessage={event => this.setText(event.nativeEvent.data)}
            style={{ height: 300 }} />
        </Content>  
      </Wrapper>
    );
  }
}