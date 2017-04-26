import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from './base';
import theme, { variables } from '../theme';
import eventService from '../services/event';
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

export default class EventCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    eventService.next().subscribe(event => {
      this.setState({ loading: false, event });
    }, () => {
      this.setState({ loading: false });
    });
  }

  render() {
    const event = this.state.event;

    return (
      <Card>
        <CardItem header>
          <Text>Próximo Evento</Text>
        </CardItem>
        { this.state.loading ?
          <CardItem>
            <Body style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </Body>
          </CardItem>
          :
          !event ?
          <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
            <Text note>Não foi possível carregar</Text>
          </CardItem> 
          :
          <View>
            <CardItem button onPress={() => this.navigate('EventDetails', { event, date: event.dates[0] })}>
              <Icon name="calendar" />
              <View>
                <Text>{event.title}</Text>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'dddd, DD [de] MMMM [de] YYYY')}
                </Text>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'HH:mm')}
                  {event.dates[0].endDate ? ' - ' + dateFormatter.format(event.dates[0].endDate, 'HH:mm') : ''}
                </Text>
              </View>  
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>  
            <CardItem footer style={StyleSheet.flatten(theme.alignRight)}>
              <Button transparent onPress={() => this.navigate('Event')}>
                <Text>VER TODOS</Text>
              </Button>  
            </CardItem>
          </View>  
        }  
       
      </Card>
    );
  }
}