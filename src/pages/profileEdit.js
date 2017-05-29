import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Title } from 'native-base';

import BaseComponent from '../components/base';
import Field from '../components/field';
import Loader from '../components/loader';
import React from 'react';
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

  componentWillUnmount() {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
  }

  updateModel(key, value) {
    let { profile, addressCities } = this.state;
    profile[key] = value;

    if (key === 'state') {
      addressCities = addressService.citites(value);
    }

    profileValidator.validate(profile).then(() => {
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
          <Form>
            <List>
              <Field
                label="Nome"
                icon="person"
                model={profile}
                ref="firstName"
                field="firstName"
                errors={validation}
                next={() => this.refs.lastName}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Sobrenome"
                icon="empty"
                model={profile}
                ref="lastName"
                field="lastName"
                errors={validation}
                next={() => this.refs.email}
                onChange={this.updateModel.bind(this)}
              />

              <Field
                label="Email"
                icon="mail"
                model={profile}
                ref="email"
                field="email"
                type="email"
                errors={validation}
                next={() => this.refs.gender}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Sexo"
                icon="male"
                model={profile}
                ref="gender"
                field="gender"
                type="dropdown"
                options={genderOptions}
                errors={validation}
                next={() => this.refs.birthday}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Aniversário"
                icon="calendar"
                model={profile}
                ref="birthday"
                field="birthday"
                type="date"
                errors={validation}
                next={() => this.refs.zipcode}
                onChange={this.updateModel.bind(this)}
              />

              <Field
                label="Cep"
                icon="pin"
                model={profile}
                ref="zipcode"
                field="zipcode"
                type="number"
                errors={validation}
                next={() => this.refs.address}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Endereço"
                icon="empty"
                model={profile}
                ref="address"
                field="address"
                errors={validation}
                next={() => this.refs.number}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Número"
                icon="empty"
                model={profile}
                ref="number"
                field="number"
                errors={validation}
                next={() => this.refs.complement}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Complemento"
                icon="empty"
                model={profile}
                ref="complement"
                field="complement"
                errors={validation}
                next={() => this.refs.neighborhood}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Bairro"
                icon="empty"
                model={profile}
                ref="neighborhood"
                field="neighborhood"
                errors={validation}
                next={() => this.refs.state}
                onChange={this.updateModel.bind(this)}
              />
              <Field
                label="Estado"
                icon="empty"
                model={profile}
                ref="state"
                field="state"
                type="dialog"
                options={addressStates}
                errors={validation}
                next={() => this.refs.city}
                onChange={this.updateModel.bind(this)}
              />
              <Field label="Cidade"
                icon="empty"
                model={profile}
                ref="city"
                field="city"
                type="dialog"
                options={addressCities}
                errors={validation}
                onChange={this.updateModel.bind(this)}
                onSubmit={() => this.save()}
              />
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}
