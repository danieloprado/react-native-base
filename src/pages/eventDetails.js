import React from 'react';
import { StyleSheet } from 'react-native';
import { variables } from '../theme';
import dateFormatter from '../formatters/date';
import BaseComponent from '../components/base';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  View,
  H2,
  Text
} from 'native-base';

export default class EventDetailsPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { eventData: this.params.eventData };
  }

  render() {
    const eventData = this.state.eventData;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
                <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Evento</Title>
          </Body>
          <Right /> 
        </Header>
        <Content>
          <View style={StyleSheet.flatten(styles.header)}>
            <H2 style={StyleSheet.flatten(styles.headerText)}>{eventData.event.title}</H2>
            <Text note style={StyleSheet.flatten(styles.headerNote)}>
              {dateFormatter.format(eventData.beginDate, 'ddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
              {eventData.endDate ? ' - ' + dateFormatter.format(eventData.endDate, 'HH:mm') : ''}
            </Text>
          </View>
          <Text style={StyleSheet.flatten(styles.content)}>
            {eventData.event.description || 'Sem descrição'}
          </Text>
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: variables.accent,
    padding: 16
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  content: {
    padding: 16
  }
});