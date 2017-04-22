import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import churchService from '../services/church';
import phoneFormatter from '../formatters/phone';
import {
  Text,
  Body,
  Card,
  CardItem,
  Spinner,
  View,
  Icon
} from 'native-base';

export default class ChurchCard extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };

    churchService.info().subscribe(church => {
      this.setState({ loading: false, church });
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
            <Body style={StyleSheet.flatten(styles.spinnerBody)}>
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
              <Text>{this.state.church.address}</Text>
            </CardItem>
            <CardItem footer>
              <Text>Detalhes</Text>
            </CardItem>
          </View>  
        }  
       
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  spinnerBody: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});