import { Body, Button, Card, CardItem, Icon, Spinner, Text, View } from 'native-base';
import { Linking, StyleSheet } from 'react-native';

import BaseComponent from './base';
import React from 'react';
import churchService from '../services/church';
import phoneFormatter from '../formatters/phone';
import theme from '../theme';
import { variables } from '../theme';

export default class ChurchCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.subscription = churchService.info().subscribe(church => {
      this.setState({ loading: false, church });
    }, () => {
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  openPhone() {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  openAddress() {
    Linking.openURL(`geo:${this.state.church.latitude},${this.state.church.longitude}?q=${this.state.church.address}`);
  }

  render() {
    const church = this.state.church;

    return (
      <Card>
        <CardItem header>
          <Text>Igreja</Text>
        </CardItem>
        {this.state.loading ?
          <CardItem>
            <Body style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </Body>
          </CardItem>
          :
          !church ?
            <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
              <Text note>Não conseguimos atualizar</Text>
            </CardItem>
            :
            <View>
              {!church.phone ? null :
                <CardItem button onPress={() => this.openPhone()}>
                  <Icon name="call" />
                  <Text>{phoneFormatter(church.phone)}</Text>
                </CardItem>
              }
              {!church.address ? null :
                <CardItem button onPress={() => this.openAddress()}>
                  <Icon name="pin" />
                  <Text style={StyleSheet.flatten(theme.cardItemMultiline)}>
                    {church.address}
                  </Text>
                </CardItem>
              }
              <CardItem footer style={StyleSheet.flatten(theme.alignRight)}>
                <Button transparent onPress={() => this.navigate('Church')}>
                  <Text>DETALHES</Text>
                </Button>
              </CardItem>
            </View>
        }

      </Card>
    );
  }
}