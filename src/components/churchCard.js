import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import churchService from '../services/church';
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
            <CardItem>
              <Icon name="call" />  
              <Text>{this.state.church.phone}</Text>
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