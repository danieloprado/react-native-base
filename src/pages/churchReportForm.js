import { Body, Button, Container, Content, Header, Icon, Left, Right, Title } from 'native-base';

import BaseComponent from '../components/base';
import Field from '../components/field';
import Loader from '../components/loader';
import React from 'react';
import churchReportValidator from '../validators/churchReport';
import profileService from '../services/profile';
import toast from '../services/toast';

export default class ChurchReportFormPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { model: {}, validation: {} };
  }

  updateModel(key, value) {
    let { model } = this.state;
    model[key] = value;

    churchReportValidator.validate(model).then(() => {
      this.setState({ validation: {}, model }, true);
    }).catch(errors => {
      this.setState({ validation: errors, model }, true);
    });
  }

  save() {
    churchReportValidator.validate(this.state.profile).then(model => {
      this.setState({ validation: {} });
      this.subscription = this.refs.loader.fromObservable(profileService.save(model)).subscribe(() => {
        this.goBack();
      }, err => {
        toast('Não foi possível salvar');
        console.log(err);
      });
    }).catch(errors => {
      this.setState({ validation: errors });
    });
  }

  render() {
    const { model, validation } = this.state;

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
            <Button transparent onPress={() => this.save()}>
              <Icon name="checkmark" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Field label="Descrição" icon="person" model={model} field="title" errors={validation} onChange={this.updateModel.bind(this)} />
          <Field label="Data" icon="calendar" model={model} field="date" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
          <Field label="Total de Membros" icon="contacts" model={model} field="totalMembers" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
          <Field label="Total de Visitantes" icon="empty" model={model} field="totalNewVisitors" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
          <Field label="Total de Frequentadores" icon="empty" model={model} field="totalFrequentVisitors" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
          <Field label="Total de Crianças" icon="empty" model={model} field="totalKids" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
        </Content>
      </Container>
    );
  }
}