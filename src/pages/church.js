import {
  Body,
  Button,
  Container,
  Content,
  H2,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Text,
  Title,
  View,
} from 'native-base';
import React from 'react';
import { Image, Linking, StyleSheet } from 'react-native';

import BaseComponent from '../components/base';
import EmptyMessage from '../components/emptyMessage.js';
import phoneFormatter from '../formatters/phone';
import services from '../services';
import { theme, variables } from '../theme';

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

    this.churchService = services.get('churchService');
    this.state = { loading: true };
  }

  componentDidMount() {
    this.churchService.info()
      .logError()
      .bindComponent(this)
      .subscribe(church => this.setState({ loading: false, church }));
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
            <View style={theme.alignCenter}>
              <Spinner color={variables.accent} />
            </View>
            : !church ?
              <EmptyMessage icon="sad" message="Não conseguimos atualizar" />
              :
              <View style={styles.container}>
                <View style={theme.alignCenter}>
                  <Image source={require('../images/logo.png')} style={styles.logo} />
                  <H2 style={styles.headerText}>{church.name}</H2>
                </View>
                <List style={styles.list}>
                  {!church.phone ? null :
                    <ListItem
                      button
                      onPress={() => this.openPhone()}
                      style={styles.listItem}>
                      <Left style={theme.listIconWrapper}>
                        <Icon name="call" style={theme.listIcon} />
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
                      style={styles.listItem}>
                      <Left style={theme.listIconWrapper}>
                        <Icon name="mail" style={theme.listIcon} />
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
                      style={styles.listItem}>
                      <Left style={theme.listIconWrapper}>
                        <Icon name="pin" style={theme.listIcon} />
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
                        style={styles.listItem}>
                        <Left style={theme.listIconWrapper}>
                          <Icon name={icon} style={theme.listIcon} />
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