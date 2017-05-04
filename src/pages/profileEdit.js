import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import Field from '../components/field';
import theme, { variables } from '../theme';
import Loader from '../components/loader';
import profileService from '../services/profile';
import profileValidator from '../validators/profile';
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
  Text,
  View,
  Spinner,
  Form,
  List
} from 'native-base';

const genderOptions = [
  { value: null, display: 'Não informado' },
  { value: 'm', display: 'Masculino' },
  { value: 'f', display: 'Feminino' },
];

export default class ProfileEditPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    profileService.get(true).first().subscribe(profile => {
      this.setState({ loading: false, profile });
    }, () => {
      this.setState({ loading: false, error: true });
    });
  }

  updateModel(key, value) {
    this.state.profile[key] = value;
    this.setState({ profile: this.state.profile }, true);

    clearTimeout(this.validationTimeout);
    this.validationTimeout = setTimeout(() => this.validate().catch(() => {}), 100);
  }

  validate() {
    return profileValidator.validate(this.state.profile).catch(errors => {
      this.setState({ validation: errors });
      return Promise.reject(errors);
    });
  }

  save() {
    this.validate().then(() => {
      this.refs.loader.fromObservable(profileService.save(this.state.profile)).subscribe(() => {
        this.goBack();
      });
    }).catch(() => {});
  }

  render() {
    let { profile, loading, error, validation } = this.state;
    validation = validation || {};

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
              <Title>Atualizar Perfil</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.save()}>
              <Icon name="checkmark" />
            </Button>
          </Right>
        </Header>
        <Content padder={true}>
          { loading ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </View>
            : error ?  
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não foi possível carregar</Text>
            </View>
            :
            <Form>
              <List>
                <Field label="Nome" icon="person" model={profile} field="firstName" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Sobrenome" icon="empty" model={profile} field="lastName" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Email" icon="mail" model={profile} field="email" type="email" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Sexo" icon="male" model={profile} field="gender" type="multi" options={genderOptions} errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Aniversário" icon="calendar" model={profile} field="birthday" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Cep" icon="pin" model={profile} field="cep" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Endereço" icon="empty" model={profile} field="address" errors={validation} onChange={this.updateModel.bind(this)} />
              </List>
            </Form>
          }
        </Content>  
      </Container>
    );
  }
}

// const styles = StyleSheet.create({

// });