import { Body, Button, Container, Content, Form, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import { ListView, Modal } from 'react-native';
import { Subject } from 'rxjs';

import { QuizFormValidator } from '../validators/quizForm';
import BaseComponent from './base';
import Field from './field';

export default class QuizFormModal extends BaseComponent {

  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.result$ = null;
    this.state = { show: false };
  }

  show(title, quiz, submitCallback) {
    this.setState({ show: true, submitted: false, title, quiz, model: {}, submitCallback, validation: null });

    this.validator = new QuizFormValidator(quiz);

    this.result$ = new Subject();
    return this.result$;
  }

  hide() {
    this.result$.next(null);
    this.result$.complete();

    this.setState({ show: false });
  }

  complete(result) {
    this.setState({ show: false });

    this.result$.next(result);
    this.result$.complete();
  }

  submit() {
    const { model, quiz } = this.state;

    this.validator.validate(model)
      .do(({ model, errors }) => this.setState({ validation: errors, model, submitted: true }, true))
      .filter(({ valid }) => valid)
      .map(({ model }) => {
        return {
          quizId: quiz.id,
          quizVersion: quiz.version,
          answers: quiz.questions.map((question, index) => {
            return { title: question.title, answer: model[`question-${index}`] };
          })
        };
      })
      .switchMap(model => this.state.submitCallback(model))
      .logError()
      .bindComponent(this)
      .subscribe(result => this.complete(result));
  }

  getOptions(question) {
    if (!question.options) return;

    const options = question.options.map(t => ({ value: t.title, display: t.title }));
    return [{ value: null, display: 'Selecione...' }, ...options];
  }

  render() {
    const { show, title, quiz, model, validation, submitted } = this.state;
    const types = { 'choose-one': 'dropdown', 'multiple': 'text' };
    const icons = { 'Nome': 'person', 'Nascimento': 'calendar', 'Celular': 'phone-portrait' };

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={show}
        onRequestClose={() => this.hide()}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.hide()}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body>
              <Title>{title}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder keyboardShouldPersistTaps="handled">
            {show &&
              <Form>
                <ListView
                  removeClippedSubviews={false}
                  enableEmptySections={true}
                  dataSource={this.dataSource.cloneWithRows(quiz.questions)}
                  renderRow={(question, section, index) =>
                    <Field
                      key={question.id}
                      label={question.title}
                      model={model}
                      icon={icons[question.title] || 'empty'}
                      field={`question-${index}`}
                      type={types[question.type] || question.type}
                      options={this.getOptions(question)}
                      errors={validation}
                      onChange={this.updateModel.bind(this, submitted ? this.validator : null)}
                      onSubmit={index === (quiz.questions.length - 1) ? () => this.submit() : undefined}
                    />
                  } />

                <Button block formButton onPress={() => this.submit()}>
                  <Text>Salvar</Text>
                </Button>
              </Form>
            }
          </Content>
        </Container>
      </Modal>
    );
  }
}