import React from 'react';
import { StyleSheet, Image, Linking } from 'react-native';
import BaseComponent from '../components/base';
import theme, { variables } from '../theme';
import churchService from '../services/church';
import phoneFormatter from '../formatters/phone';
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
  View,
  H2,
  Spinner,
  List,
  ListItem,
  Text
} from 'native-base';

export default class ChurchPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Igreja',
    drawerIcon: ({ tintColor }) => (
      <Icon name="information-circle" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    churchService.info().subscribe(church => {
      this.setState({ loading: false, church });
    }, () => {
      this.setState({ loading: false });
    });
  }

  openPhone() {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  openAddress() {
    Linking.openURL(`geo:${this.state.church.latitude},${this.state.church.longitude}?q=${this.state.church.address}`);
  }

  openEmail() {
    Linking.openURL(`mailto:${this.state.church.email}`);
  }

  openUrl(url) {
    Linking.openURL(url);
  }

  render() {
    const church = this.state.church;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>{church ? church.name : 'Igreja'}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          { this.state.loading ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </View>
            : !church ?
              <View style={StyleSheet.flatten(theme.emptyMessage)}>
                <Text note>Não foi possível carregar</Text>
              </View> 
            :  
            <View style={StyleSheet.flatten(styles.container)}>
              <View style={StyleSheet.flatten(theme.alignCenter)}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <H2 style={StyleSheet.flatten(styles.headerText)}>{church.name}</H2>
              </View>
              <List style={StyleSheet.flatten(styles.list)}>
                { !church.phone ? null :
                  <ListItem
                    button
                    onPress={() => this.openPhone()}
                    style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="call" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{phoneFormatter(church.phone)}</Text>
                    </Body>
                  </ListItem>
                }
                { !church.email ? null :
                  <ListItem
                    button
                    onPress={() => this.openEmail()}
                    style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="mail" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{church.email}</Text>
                    </Body>
                  </ListItem>
                }  
                { !church.address ? null :
                  <ListItem
                    button
                    onPress={() => this.openAddress()}
                    style={StyleSheet.flatten(styles.listItem)}>
                    <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                      <Icon name="pin" style={StyleSheet.flatten(theme.listIcon)} />
                    </Left>
                    <Body>
                      <Text>{church.address}</Text>
                    </Body>
                  </ListItem>
                }  
                {church.social.map(social => {
                  const icons = { facebook: 'logo-facebook', youtube: 'logo-youtube' };
                  const icon = icons[social.name] || 'globe';

                  return (
                    <ListItem
                      key={social.name}  
                      button
                      onPress={() => this.openUrl(social.url)}
                      style={StyleSheet.flatten(styles.listItem)}>
                      <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                        <Icon name={icon} style={StyleSheet.flatten(theme.listIcon)} />
                      </Left>
                      <Body>
                        <Text>{social.name === 'website' ? social.url : social.name.toUpperCase()}</Text>
                      </Body>
                    </ListItem>
                  );
                })}  
              </List>
            </View>  
          }  
        </Content>  
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30
  },
  headerText: {
    opacity: 0.6
  },
  list: {
    marginTop: 30
  },
  listItem: {
    borderBottomWidth: 0
  }
});