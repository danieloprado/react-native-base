import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Title } from 'native-base';
import * as React from 'react';

import { BaseComponent } from '../../components/base';
import { Field } from '../../components/field';
import toast from '../../providers/toast';
import services from '../../services';
import { ProfileValidator } from '../../validators/profile';

const genderOptions = [
  { value: null, display: 'Não informado' },
  { value: 'm', display: 'Masculino' },
  { value: 'f', display: 'Feminino' },
];

export default class ProfileEditPage extends BaseComponent {
  constructor(props: any) {
    super(props);

    this.profileValidator = new ProfileValidator();
    this.addressService = services.get('addressService');
    this.profileService = services.get('profileService');

    this.state = {
      model: this.params.profile,
      addressStates: this.addressService.states(),
      addressCities: this.addressService.citites(this.params.profile.state)
    };
  }

  updateModel(validator, key, value) {
    if (key === 'state') {
      const addressCities = this.addressService.citites(value);
      this.setState({ addressCities }, true);
    }

    super.updateModel(validator, key, value);
  }

  save() {
    this.profileValidator.validate(this.state.model)
      .do(({ model, errors }) => this.setState({ validation: errors, model }, true))
      .filter(({ valid }) => valid)
      .switchMap(({ model }) => this.profileService.save(model).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => this.goBack(), () => toast.genericError());
  }

  public render(): JSX.Element {
    let { model, validation, addressStates, addressCities } = this.state;
    validation = validation || {};

    return (
      <Container>
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
        <Content padder keyboardShouldPersistTaps="handled">
          <Form>
            <List>
              <Field
                label="Nome"
                icon="person"
                model={model}
                ref="firstName"
                field="firstName"
                errors={validation}
                next={() => this.refs.lastName}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Sobrenome"
                icon="empty"
                model={model}
                ref="lastName"
                field="lastName"
                errors={validation}
                next={() => this.refs.email}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />

              <Field
                label="Email"
                icon="mail"
                model={model}
                ref="email"
                field="email"
                type="email"
                errors={validation}
                next={() => this.refs.gender}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Sexo"
                icon="male"
                model={model}
                ref="gender"
                field="gender"
                type="dropdown"
                options={genderOptions}
                errors={validation}
                next={() => this.refs.birthday}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Aniversário"
                icon="calendar"
                model={model}
                ref="birthday"
                field="birthday"
                type="date"
                errors={validation}
                next={() => this.refs.zipcode}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />

              <Field
                label="Cep"
                icon="pin"
                model={model}
                ref="zipcode"
                field="zipcode"
                type="zipcode"
                errors={validation}
                next={() => this.refs.address}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Endereço"
                icon="empty"
                model={model}
                ref="address"
                field="address"
                errors={validation}
                next={() => this.refs.number}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Número"
                icon="empty"
                model={model}
                ref="number"
                field="number"
                errors={validation}
                next={() => this.refs.complement}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Complemento"
                icon="empty"
                model={model}
                ref="complement"
                field="complement"
                errors={validation}
                next={() => this.refs.neighborhood}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Bairro"
                icon="empty"
                model={model}
                ref="neighborhood"
                field="neighborhood"
                errors={validation}
                next={() => this.refs.state}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field
                label="Estado"
                icon="empty"
                model={model}
                ref="state"
                field="state"
                type="dialog"
                options={addressStates}
                errors={validation}
                next={() => this.refs.city}
                onChange={this.updateModel.bind(this, this.profileValidator)}
              />
              <Field label="Cidade"
                icon="empty"
                model={model}
                ref="city"
                field="city"
                type="dialog"
                options={addressCities}
                errors={validation}
                onChange={this.updateModel.bind(this, this.profileValidator)}
                onSubmit={() => this.save()}
              />
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}
