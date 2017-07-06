import { Body, Button, Container, Content, H2, Header, Icon, Left, List, ListItem, Right, Spinner, Text, Title, View } from 'native-base';
import { Image, Linking, StyleSheet } from 'react-native';
import theme, { variables } from '../theme';

import BaseComponent from '../components/base';
import React from 'react';
import churchService from '../services/church';
import logService from '../services/log';
import phoneFormatter from '../formatters/phone';

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
    this.subscription = churchService.info().subscribe(church => {
      this.setState({ loading: false, church });
    }, err => {
      this.setState({ loading: false });
      logService.handleError(err);
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
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
          {this.state.loading ?
            <View style={StyleSheet.flatten(theme.alignCenter)}>
              <Spinner color={variables.accent} />
            </View>
            : !church ?
              <View style={StyleSheet.flatten(theme.emptyMessage)}>
                <Text note>Não conseguimos atualizar</Text>
              </View>
              :
              <View style={StyleSheet.flatten(styles.container)}>
                <View style={StyleSheet.flatten(theme.alignCenter)}>
                  <Image source={require('../images/logo.png')} style={styles.logo} />
                  <H2 style={StyleSheet.flatten(styles.headerText)}>{church.name}</H2>
                </View>
                <List style={StyleSheet.flatten(styles.list)}>
                  {!church.phone ? null :
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
                  {!church.email ? null :
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
                  {!church.address ? null :
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