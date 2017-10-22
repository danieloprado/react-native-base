import { Body, Button, Container, Content, H2, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import BaseComponent from '../../components/base';
import QuizFormModal from '../../components/quizFormModal';
import dateFormatter from '../../formatters/date';
import toast from '../../providers/toast';
import services from '../../services';
import { variables } from '../../theme';

export default class EventDetailsPage extends BaseComponent {
  constructor(props) {
    super(props);

    this.quizService = services.get('quizService');

    this.state = {
      event: this.params.event,
      date: this.params.date
    };
  }

  form() {
    const { event } = this.state;

    this.refs.quizForm.show('Inscrição', event.quiz, this.saveForm.bind(this))
      .logError()
      .bindComponent(this)
      .subscribe(result => {
        if (!result) return;
        toast('Inscrição efetuada com sucesso!');
      });
  }

  saveForm(model) {
    return this.quizService.saveAnswer(model).loader();
  }

  render() {
    const { event, date } = this.state;

    return (
      <Container>
        <QuizFormModal ref="quizForm" />
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
          <View style={styles.header}>
            <H2 style={styles.headerText}>{event.title}</H2>
            <Text note style={styles.headerNote}>
              {dateFormatter.format(date.beginDate, 'ddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
              {date.endDate ? ' - ' + dateFormatter.format(date.endDate, 'HH:mm') : ''}
            </Text>
          </View>
          <Text style={styles.content}>
            {event.description || 'Sem descrição'}
          </Text>
          {!!event.quiz &&
            <View padder>
              <Button block onPress={() => this.form()}>
                <Text>Fazer inscrição</Text>
              </Button>
            </View>
          }
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