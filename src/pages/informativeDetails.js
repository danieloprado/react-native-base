import { Body, Button, Container, Header, Icon, Left, Right, Spinner, Text, Title, View } from 'native-base';
import { Share, StyleSheet, WebView } from 'react-native';
import informativeService, { enInformativeType } from '../services/informative';
import theme, { variables } from '../theme';

import BaseComponent from '../components/base';
import React from 'react';
import informativeRender from '../formatters/informativeRender';

export default class InformativeDetailsPage extends BaseComponent {
  constructor(props) {
    super(props);

    const { informative } = this.params;

    this.state = {
      loading: informative ? false : true,
      informative,
      html: informative ? informativeRender(informative) : null
    };
  }

  componentDidMount() {
    if (this.state.informative) return;

    informativeService.get(this.params.id).subscribe(informatives => {
      const informative = informatives;
      const html = informative ? informativeRender(informative) : null;

      this.setState({ loading: false, informative, html });
    });
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
    const { loading, html, informative } = this.state;
    let title = 'Informativo';

    if (informative) {
      title = informative.type === enInformativeType.cell ? 'Célula' : 'Igreja';
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
                <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right>
            {informative && 
              <Button transparent onPress={() => this.share()}>
                  <Icon name='share' />
              </Button>  
            }
          </Right>  
        </Header>
        {loading ?
          <View style={StyleSheet.flatten(theme.alignCenter)}>
            <Spinner color={variables.accent} />
          </View>
        : !informative ?
          <View style={StyleSheet.flatten(theme.emptyMessage)}>
            <Text note>Não foi possível carregar</Text>
          </View>
        :
          <View style={{flex: 1}}>
            <WebView
              source={{ html }}
              onMessage={event => this.setText(event.nativeEvent.data)}
              style={{flex: 1}} />
          </View>  
        }
       
      </Container>
    );
  }
}