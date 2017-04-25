import React from 'react';
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
  H1,
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
          <View>
            <H1>{eventData.event.title}</H1>
            <Text note>
              {dateFormatter.format(eventData.beginDate, 'ddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
              {eventData.endDate ? ' - ' + dateFormatter.format(eventData.endDate, 'HH:mm') : ''}
            </Text>
          </View>
          <Text>{eventData.event.description || 'Sem descrição'}</Text>
        </Content>  
      </Container>
    );
  }
}