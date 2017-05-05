import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import Field from '../components/field';
import theme, { variables } from '../theme';
import Loader from '../components/loader';
import profileService from '../services/profile';
import addressService from '../services/address';
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
    this.state = {
      loading: true,
      addressStates: [
        { value: null, display: 'Não informado' },
        ...addressService.states()
      ],
      addressCities: [
        { value: null, display: 'Selecione o estado' },
      ]
    };
  }

  componentDidMount() {
    profileService.get(true).first().subscribe(profile => {
      this.setState({ loading: false, profile });
      this.loadCities(profile);
    }, () => {
      this.setState({ loading: false, error: true });
    });
  }

  updateModel(key, value) {
    this.state.profile[key] = value;
    this.setState({ profile: this.state.profile }, true);

    if (key === 'state') {
      this.loadCities(this.state.profile);
    }

    clearTimeout(this.validationTimeout);
    this.validationTimeout = setTimeout(() => this.validate().catch(() => {}), 100);
  }

  loadCities(profile) {
    let addressCities = [{ value: null, display: 'Selecione o estado' }];

    if (profile && profile.state) {
      addressCities = [
        { value: null, display: 'Não informado' },
        ...addressService.citites(profile.state)
      ];
    }

    this.setState({ addressCities });
  }

  validate() {
    return profileValidator.validate(this.state.profile).then(() => {
      this.setState({ validation: {} });
    }).catch(errors => {
      this.setState({ validation: errors });
      return Promise.reject(errors);
    });
  }

  save() {
    clearTimeout(this.validationTimeout);
    this.validate().then(() => {
      this.refs.loader.fromObservable(profileService.save(this.state.profile)).subscribe(() => {
        this.goBack();
      });
    }).catch(() => {});
  }

  render() {
    let { profile, loading, error, validation, addressStates, addressCities } = this.state;
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
                <Field label="Sexo" icon="male" model={profile} field="gender" type="dropdown" options={genderOptions} errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Aniversário" icon="calendar" model={profile} field="birthday" type="date" errors={validation} onChange={this.updateModel.bind(this)} />
                
                <Field label="Cep" icon="pin" model={profile} field="cep" type="number" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Endereço" icon="empty" model={profile} field="address" errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Estado" icon="empty" model={profile} field="state" type="dialog" options={addressStates} errors={validation} onChange={this.updateModel.bind(this)} />
                <Field label="Cidade" icon="empty" model={profile} field="city" type="dialog" options={addressCities} errors={validation} onChange={this.updateModel.bind(this)} />
              </List>
            </Form>
          }
          </View>
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 16
  }
});