import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import Field from '../components/field';
import theme, { variables } from '../theme';
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
  Form
} from 'native-base';

const genderOptions = [
  { value: null, display: 'Não informado' },
  { value: 'm', display: 'Masculino' },
  { value: 'f', display: 'Feminino' },
];

export default class ProfilePage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Perfil',
    drawerIcon: ({ tintColor }) => (
      <Icon name="contact" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, profile: { firstName: 'Dan', lastName: 'Prado', birthday: new Date(1992, 0, 5) } };
  }

  componentDidMount() {
    // profileService.get().first().subscribe(profile => {
    //   profileValidator.validate(profile).then(result => console.log(result));
    //   this.setState({ loading: false, profile });
    // }, () => {
    //   this.setState({ loading: false, error: true });
    // });
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
      alert('ok');
    });
  }

  render() {
    let { profile, loading, error, validation } = this.state;
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
              <Title>Editar</Title>
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
              <Text>{JSON.stringify(profile)}</Text>
              <Field label="Nome" model={profile} field="firstName" errors={validation} onChange={this.updateModel.bind(this)} />
              <Field label="Sobrenome" model={profile} field="lastName" errors={validation} onChange={this.updateModel.bind(this)} />
              <Field label="Email" model={profile} field="email" type="email" errors={validation} onChange={this.updateModel.bind(this)} />
              <Field label="Sexo" model={profile} field="gender" type="multi" options={genderOptions} errors={validation} onChange={this.updateModel.bind(this)} />
              <Field label="Aniversário" model={profile} field="birthday" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
            </Form>          
          }
        </Content>  
      </Container>
    );
  }
}

// const styles = StyleSheet.create({

// });