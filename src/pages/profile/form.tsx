import { Body, Button, Container, Content, Form, Header, Icon, Left, List, Right, Title } from 'native-base';
import * as React from 'react';

import { IUser } from '../../interfaces/user';
import { toastError } from '../../providers/toast';
import profileService from '../../services/profile';
import FormComponent, { IStateForm } from '../../shared/abstract/formComponent';
import { Field } from '../../shared/field';
import { ProfileValidator } from '../../validators/profile';

export default class ProfileEditPage extends FormComponent<IStateForm<IUser>> {
  private profileValidator: ProfileValidator;

  constructor(props: any) {
    super(props);

    this.profileValidator = new ProfileValidator();
    this.state = { model: {} };
  }

  public save(): void {
    this.isFormValid(this.profileValidator)
      .filter(valid => valid)
      .switchMap(() => profileService.save(this.state.model as IUser).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.navigateBack();
      }, err => toastError(err));
  }

  public render(): JSX.Element {
    let { model, validation } = this.state;
    validation = validation || {};

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.navigateBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Atualizar Perfil</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.save()}>
              <Icon name='md-checkmark' />
            </Button>
          </Right>
        </Header>
        <Content padder keyboardShouldPersistTaps='handled'>
          <Form>
            <List>
              <Field
                label='Nome'
                icon='person'
                ref='firstName'
                type='text'
                value={model.firstName}
                error={validation.firstName}
                next={() => this.refs.lastName}
                onChange={this.updateModel.bind(this, this.profileValidator, 'firstName')}
              />
              <Field
                label='Sobrenome'
                icon='empty'
                ref='lastName'
                type='text'
                value={model.lastName}
                error={validation.lastName}
                next={() => this.refs.email}
                onChange={this.updateModel.bind(this, this.profileValidator, 'lastName')}
              />

              <Field
                label='Email'
                icon='mail'
                ref='email'
                type='email'
                value={model.email}
                error={validation.email}
                next={() => this.refs.gender}
                onChange={this.updateModel.bind(this, this.profileValidator, 'email')}
              />
              <Field
                label='Sexo'
                icon='male'
                ref='gender'
                type='dropdown'
                value={model.gender}
                options={[
                  { value: null, display: 'Não informado' },
                  { value: 'm', display: 'Masculino' },
                  { value: 'f', display: 'Feminino' },
                ]}
                error={validation.gender}
                next={() => this.refs.birthday}
                onChange={this.updateModel.bind(this, this.profileValidator, 'gender')}
              />
              <Field
                label='Aniversário'
                icon='calendar'
                ref='birthday'
                type='date'
                value={model.birthday}
                error={validation.birthday}
                next={() => this.refs.zipcode}
                onChange={this.updateModel.bind(this, this.profileValidator, 'birthday')}
              />

              <Field
                label='Cep'
                icon='pin'
                ref='zipcode'
                type='zipcode'
                value={model.zipcode}
                error={validation.zipcode}
                next={() => this.refs.address}
                onChange={this.updateModel.bind(this, this.profileValidator, 'zipcode')}
              />
              <Field
                label='Endereço'
                icon='empty'
                ref='address'
                type='text'
                value={model.address}
                error={validation.address}
                next={() => this.refs.number}
                onChange={this.updateModel.bind(this, this.profileValidator, 'address')}
              />
              <Field
                label='Número'
                icon='empty'
                ref='number'
                type='text'
                value={model.number}
                error={validation.number}
                next={() => this.refs.complement}
                onChange={this.updateModel.bind(this, this.profileValidator, 'number')}
              />
              <Field
                label='Complemento'
                icon='empty'
                ref='complement'
                type='text'
                value={model.complement}
                error={validation.complement}
                next={() => this.refs.neighborhood}
                onChange={this.updateModel.bind(this, this.profileValidator, 'complement')}
              />
              <Field
                label='Bairro'
                icon='empty'
                ref='neighborhood'
                type='text'
                value={model.neighborhood}
                error={validation.neighborhood}
                next={() => this.refs.state}
                onChange={this.updateModel.bind(this, this.profileValidator, 'neighborhood')}
              />
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}
