import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import theme, { variables } from '../theme';

import BaseComponent from './base';
import React from 'react';
import { StyleSheet } from 'react-native';
import dateFormatter from '../formatters/date';
import informativeService from '../services/informative';

export default class InformativeCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.subscription = informativeService.last().subscribe(informative => {
      this.setState({ loading: false, informative });
    }, () => {
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
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
              <Spinner color={variables.accent} />
            </Body>
          </CardItem>
          :
          !informative ?
          <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
            <Text note>Não foi possível carregar</Text>
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