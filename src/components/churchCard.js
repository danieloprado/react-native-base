import React from 'react';
import { StyleSheet, Linking, TouchableNativeFeedback } from 'react-native';
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
    }, err => {
      console.log(err);
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
              <TouchableNativeFeedback>
                <Button transparent>
                  <Text>DETALHES</Text>
                </Button>  
              </TouchableNativeFeedback>  
            </CardItem>
          </View>  
        }  
       
      </Card>
    );
  }
}