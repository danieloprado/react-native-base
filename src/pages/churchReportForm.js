import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Spinner, Text, Title, View } from 'native-base';
import theme, { variables } from '../theme';

import BaseComponent from '../components/base';
import Field from '../components/field';
import Loader from '../components/loader';
import React from 'react';
import { StyleSheet } from 'react-native';
import churchReportService from '../services/churchReport';
import churchReportValidator from '../validators/churchReport';
import dateFormatter from '../formatters/date';
import toast from '../services/toast';

export default class ChurchReportFormPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      model: {
        title: `Culto de ${dateFormatter.format(new Date, 'dddd')}`,
        date: new Date
      },
      validation: {}
    };
  }

  componentDidMount() {
    this.subscription = churchReportService.types().subscribe(types => {
      console.log(types);
    });
  }

  componentWillUnmount() {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
  }

  updateModel(key, value) {
    let { model, submitted } = this.state;
    model[key] = value;

    if (!submitted) {
      this.setState({ model }, true);
      return;
    }

    churchReportValidator.validate(model).then(() => {
      this.setState({ validation: {}, model }, true);
    }).catch(errors => {
      this.setState({ validation: errors, model }, true);
    });
  }

  save() {
    churchReportValidator.validate(this.state.profile).then(model => {
      this.setState({ validation: {}, submitted: true });
      this.subscription = this.refs.loader.fromObservable(churchReportService.save(model))
        .subscribe(() => {
          this.goBack();
        }, err => {
          toast('Não foi possível salvar');
          console.log(err);
        });
    }).catch(errors => {
      this.setState({ validation: errors, submitted: true });
    });
  }

  render() {
    const { model, validation, loading, error } = this.state;

    return (
      <Container>
        <Loader ref="loader" />
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Criar Relatório</Title>
          </Body>
          <Right>
            {!loading && !error &&
              <Button transparent onPress={() => this.save()}>
                <Icon name="checkmark" />
              </Button>
            }
          </Right>
        </Header>
        <Content>
          {loading ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </View>
            : error ?
              <View style={StyleSheet.flatten(theme.emptyMessage)}>
                <Text note>Não foi possível carregar</Text>
              </View>
              :
              <View style={StyleSheet.flatten(styles.container)}>
                <Form>
                  <List>
                    <Field label="Descrição" icon="paper" model={model} field="title" errors={validation} onChange={this.updateModel.bind(this)} />
                    <Field label="Data" icon="calendar" model={model} field="date" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
                    <Field label="Total de Membros" icon="contacts" model={model} field="totalMembers" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                    <Field label="Total de Visitantes" icon="empty" model={model} field="totalNewVisitors" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                    <Field label="Total de Frequentadores" icon="empty" model={model} field="totalFrequentVisitors" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                    <Field label="Total de Crianças" icon="empty" model={model} field="totalKids" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                  </List>
                </Form>
              </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 30
  }
});