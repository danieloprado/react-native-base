import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import BaseComponent from './base';
import theme from '../theme';
import churchService from '../services/church';
import phoneFormatter from '../formatters/phone';
import {
  Text,
  Body,
  Card,
  CardItem,
  Spinner,
  View,
  Icon,
  Button
} from 'native-base';

export default class ChurchCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    churchService.info().subscribe(church => {
      this.setState({ loading: false, church });
    }, () => {
      this.setState({ loading: false });
    });
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
        { this.state.loading ?
          <CardItem>
            <Body style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner />
            </Body>
          </CardItem>
          :
          !church ? 
          <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
            <Text note>Não foi possível carregar</Text>
          </CardItem>     
          :
          <View>
            { !church.phone ? null :
              <CardItem button onPress={() => this.openPhone()}>
                <Icon name="call" />
                <Text>{phoneFormatter(church.phone)}</Text>
              </CardItem>
            }
            { !church.address ? null :
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