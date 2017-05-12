import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Title, View } from 'native-base';

import BaseComponent from '../components/base';
import Field from '../components/field';
import Loader from '../components/loader';
import React from 'react';
import { StyleSheet } from 'react-native';
import addressService from '../services/address';
import profileService from '../services/profile';
import profileValidator from '../validators/profile';
import toast from '../services/toast';

const genderOptions = [
  { value: null, display: 'Não informado' },
  { value: 'm', display: 'Masculino' },
  { value: 'f', display: 'Feminino' },
];


export default class ProfileEditPage extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      profile: this.params.profile,
      addressStates: addressService.states(),
      addressCities: addressService.citites(this.params.profile.state)
    };
  }

  updateModel(key, value) {
    let { profile, addressCities } = this.state;
    profile[key] = value;

    if (key === 'state') {
      addressCities = addressService.citites(value);
    }

    profileValidator.validate(this.state.profile).then(() => {
      this.setState({ validation: {}, profile, addressCities }, true);
    }).catch(errors => {
      this.setState({ validation: errors, profile, addressCities }, true);
    });
  }

  validate() {
    return profileValidator.validate(this.state.profile).then(() => {
      this.setState({ validation: {} }, true);
    }).catch(errors => {
      this.setState({ validation: errors });
      return Promise.reject(errors, true);
    });
  }

  save() {
    profileValidator.validate(this.state.profile).then(model => {
      this.setState({ validation: {} });
      this.refs.loader.fromObservable(profileService.save(model)).subscribe(() => {
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
    let { profile, validation, addressStates, addressCities } = this.state;
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
        <Content>
          <View style={StyleSheet.flatten(styles.container)}>
            <Form>
              <List>
                <Field label="Nome" icon="person" model={profile} field="firstName" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Sobrenome" icon="empty" model={profile} field="lastName" errors={validation} onChange={this.updateModel.bind(this)} />
                
                <Field label="Email" icon="mail" model={profile} field="email" type="email" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Sexo" icon="male" model={profile} field="gender" type="dropdown" options={genderOptions} errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Aniversário" icon="calendar" model={profile} field="birthday" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
                
                <Field label="Cep" icon="pin" model={profile} field="zipcode" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Endereço" icon="empty" model={profile} field="address" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Número" icon="empty" model={profile} field="number" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Complemento" icon="empty" model={profile} field="complement" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Bairro" icon="empty" model={profile} field="neighborhood" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Estado" icon="empty" model={profile} field="state" type="dialog" options={addressStates} errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Cidade" icon="empty" model={profile} field="city" type="dialog" options={addressCities} errors={validation} onChange={this.updateModel.bind(this)} />
              </List>
            </Form>
          </View>
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