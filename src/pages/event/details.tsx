import { Body, Button, Container, Content, H2, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Observable } from 'rxjs/Rx';

import { dateFormatter } from '../../formatters/date';
import { IEvent, IEventDate } from '../../interfaces/event';
import { IQuizAnswer } from '../../interfaces/quizAnswer';
import { alert } from '../../providers/alert';
import { toast } from '../../providers/toast';
import quizService from '../../services/quiz';
import BaseComponent from '../../shared/abstract/baseComponent';
import { QuizFormModal } from '../../shared/quizFormModal';
import { theme } from '../../theme';

interface IState {
  event: IEvent;
  date: IEventDate;
  error?: any;
}

interface IRefs {
  quizForm: QuizFormModal;
}

export default class EventDetailsPage extends BaseComponent<IState, any, IRefs> {

  constructor(props: any) {
    super(props);

    this.state = {
      event: this.params.event,
      date: this.params.date
    };
  }

  public form(): void {
    const { event } = this.state;

    this.refs.quizForm
      .show('Inscrição', event.quiz, this.saveForm.bind(this))
      .logError()
      .bindComponent(this)
      .subscribe(result => {
        if (!result) return;

        if (event.quizSuccessMessage) {
          alert('Atenção', event.quizSuccessMessage).subscribe();
          return;
        }

        toast('Inscrição efetuada com sucesso!');
      });
  }

  public saveForm(model: IQuizAnswer): Observable<void> {
    return quizService.saveAnswer(model).loader();
  }

  public render(): JSX.Element {
    const { event, date } = this.state;

    return (
      <Container>
        <QuizFormModal ref='quizForm' />
        <Header>
          <Left>
            <Button transparent onPress={() => this.navigateBack()}>
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
          {!!event.quiz && !!event.quiz.questions.length &&
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
    backgroundColor: theme.accent,
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