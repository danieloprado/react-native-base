import React, { Component } from 'react';
import { StyleSheet, Linking, TouchableNativeFeedback, InteractionManager } from 'react-native';
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

export default class ChurchCard extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    churchService.info().subscribe(church => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ loading: false, church });
      });
    }, err => {
      console.log(err);
      alert('error');
    });
  }

  openPhone() {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  openAddress() {
    Linking.openURL(`geo:${this.state.church.latitude},${this.state.church.longitude}?q=${this.state.church.address}`);
  }

  render() {
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
            <CardItem button onPress={() => this.openPhone()}>
              <Icon name="call" />  
              <Text>{phoneFormatter(this.state.church.phone)}</Text>
            </CardItem>
            <CardItem button onPress={() => this.openAddress()}>
              <Icon name="map" />  
              <Text style={StyleSheet.flatten(theme.cardItemMultiline)}>
                {this.state.church.address}
              </Text>
            </CardItem>
            <CardItem footer style={StyleSheet.flatten(theme.alignRight)}>
              <TouchableNativeFeedback>
                <Button transparent>
                  <Text>Detalhes</Text>
                </Button>  
              </TouchableNativeFeedback>  
            </CardItem>
          </View>  
        }  
       
      </Card>
    );
  }
}