import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import theme, { variables } from '../theme';

import BaseComponent from './base';
import React from 'react';
import { StyleSheet } from 'react-native';
import dateFormatter from '../formatters/date';
import eventService from '../services/event';

export default class EventCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.subscription = eventService.next().subscribe(event => {
      this.setState({ loading: false, error: false, event });
    }, () => {
      this.setState({ loading: false, error: true });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { event, loading, error } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Próximo Evento</Text>
        </CardItem>
        {loading ?
          <CardItem>
            <Body style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </Body>
          </CardItem>
          :
          error ?
            <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
              <Text note>Não conseguimos atualizar</Text>
            </CardItem>
            :
            !event ?
              <CardItem style={StyleSheet.flatten(theme.alignCenter)}>
                <Text note>Nenhum evento próximo</Text>
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