import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
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
  Form,
  Item,
  Label,
  Input
} from 'native-base';

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
    this.state = { loading: true };
  }

  componentDidMount() {
    profileService.get().first().subscribe(profile => {
      profileValidator.validate(profile).then(result => console.log(result));
      this.setState({ loading: false, profile });
    }, () => {
      this.setState({ loading: false, error: true });
    });
  }

  render() {
    const { profile, loading, error } = this.state;

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
          <Right />
        </Header>
        <Content>
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
                <Item stackedLabel error={true}>
                  <Label>Nome</Label>
                  <Input value={this.state.firstName} onChangeText={firstName => this.setState({ firstName  }, true)}  />
                </Item>
            </Form>          
          }
        </Content>  
      </Container>
    );
  }
}

// const styles = StyleSheet.create({

// });