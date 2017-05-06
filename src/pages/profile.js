import React from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import BaseComponent from '../components/base';
import theme, { variables } from '../theme';
import profileService from '../services/profile';
import dateFormatter from '../formatters/date';
import tokenService from '../services/token';
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
  Spinner,
  List,
  ListItem
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
    this.profileStream$ = profileService.get().subscribe(profile => {
      this.setState({ loading: false, profile });
    }, () => {
      this.setState({ loading: false, error: true });
    });
  }

  componentWillUnmount() {
    this.profileStream$.unsubscribe();
  }

  logout() {
    Alert.alert(
      'Confirmar',
      'Deseja realmente sair?', [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => tokenService.clearToken().subscribe() }
      ], { cancelable: false }
    );
  }

  render() {
    const { profile, loading, error } = this.state;
    let gender = null;

    if (profile) {
      switch (profile.gender) {
        case 'm':
          gender = 'Masculino';
          break;
        case 'f':
          gender = 'Feminino';
          break;
        default:
          gender = 'Não informado';
      }
    }

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
          <Right>
            { profile && 
            <Button transparent onPress={() => this.navigate('ProfileEdit', { profile })}>
               <Icon name='create' />
            </Button>
            }
          </Right>
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
            <View style={StyleSheet.flatten([theme.emptyMessage, theme.alignCenter])}>
              <Icon name="contact" style={StyleSheet.flatten([styles.loginIcon,theme.iconLarge])} />      
              <Text style={StyleSheet.flatten(styles.loginText)}>Ainda não te conhecemos, mas gostaríamos de saber mais sobre você!</Text>
              <Button block onPress={() => this.navigate('Welcome', { force: true })}>
                <Text>ENTRAR</Text>
              </Button>
            </View> 
            :    
            <View>
                <View style={StyleSheet.flatten(styles.header)}>
                { profile.avatar ?
                  <Image style={StyleSheet.flatten(styles.avatarImg)} source={{ uri: profile.avatar }} />
                  :
                  <Icon name="contact" style={StyleSheet.flatten(styles.avatarIcon)} />
                }
                <H2 style={StyleSheet.flatten(styles.headerText)}>{profile.fullName}</H2>
              </View>
              <List style={StyleSheet.flatten(styles.list)}>
                { !profile.email ? null :
                  <ListItem style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="mail" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{profile.email}</Text>
                    </Body>
                  </ListItem>
                }
                <ListItem style={StyleSheet.flatten(styles.listItem)}>
                  <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                    <Icon name={profile.gender === 'f' ? 'female': 'male'} style={StyleSheet.flatten(theme.listIcon)} />
                  </Left>
                  <Body>
                    <Text>{gender}</Text>
                  </Body>
                </ListItem>
                { !profile.birthday ? null :
                  <ListItem style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="calendar" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{dateFormatter.formatBirthday(profile.birthday)}</Text>
                    </Body>
                  </ListItem>
                }    
                { !profile.fullAddress ? null :
                  <ListItem style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="pin" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{profile.fullAddress}</Text>
                    </Body>
                  </ListItem>
                }    
              </List>    
              <Button block light style={StyleSheet.flatten(styles.logoutButton)} onPress={() => this.logout()}>
                <Text>SAIR</Text>
              </Button>
            </View>          
          }
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginIcon: {
    marginTop: 20,
    marginBottom: 10,
    color: variables.accent
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 20
  },
  header: {
    backgroundColor: variables.accent,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 2
  },
  avatarIcon: {
    marginBottom: 10,
    color: 'white',
    fontSize: 100
  },
  content: {
    padding: 16
  },
  list: {
    marginTop: 10
  },
  listItem: {
    borderBottomWidth: 0
  },
  logoutButton: {
    margin: 16
  }
});