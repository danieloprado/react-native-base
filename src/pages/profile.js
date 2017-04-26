import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '../components/base';
import theme, { variables } from '../theme';
import profileService from '../services/profile';
// import toast from '../services/toast';
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
  H2,
  Spinner
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
    profileService.get().subscribe(profile => {
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
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
              <Title>Perfil</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          { loading ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </View>
            : !profile && error ?  
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não foi possível carregar</Text>
            </View>
            : !profile ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Text note>Nãoentrou</Text>
              <Button onPress={() => this.navigate('Welcome', { force: true })}>
                <Text>Entrar</Text>
              </Button>    
            </View> 
            :    
            <View style={StyleSheet.flatten(styles.header)}>
              <H2 style={StyleSheet.flatten(styles.headerText)}>{profile.fullName}</H2>
            </View>
          }
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: variables.accent,
    padding: 16
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  content: {
    padding: 16
  }
});