import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from './base';
import theme from '../theme';
import informativeService from '../services/informative';
import dateFormatter from '../formatters/date';
import {
  Text,
  Body,
  Card,
  CardItem,
  Spinner,
  View,
  Right,
  Icon,
  Button
} from 'native-base';

export default class InformativeCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    informativeService.last().subscribe(informative => {
      this.setState({ loading: false, informative });
    }, err => {
      console.log(err);
    });
  }

  render() {
    const informative = this.state.informative;

    return (
      <Card>
        <CardItem header>
          <Text>Último informativo</Text>
        </CardItem>
        { this.state.loading ?
          <CardItem>
            <Body style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner />
            </Body>
          </CardItem>
          :
          <View>
            <CardItem button onPress={() => this.navigate('InformativeDetails', { informative })}>
              <Icon name={informative.icon} />
              <View>
                <Text>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </View>  
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>  
            <CardItem footer style={StyleSheet.flatten(theme.alignRight)}>
              <Button transparent onPress={() => this.navigate('Informative')}>
                <Text>VER TODOS</Text>
              </Button>  
            </CardItem>
          </View>  
        }  
       
      </Card>
    );
  }
}