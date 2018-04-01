import { Body, Card, Container, Content, Header, Icon, Left, ListItem, Right, Text, Thumbnail, Title } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationTabScreenOptions } from 'react-navigation';

import { IUser } from '../interfaces/user';
import { ROUTES_ROLES } from '../navigator';
import { toastError } from '../providers/toast';
import profileService from '../services/profile';
import tokenService from '../services/token';
import { isiOS } from '../settings';
import BaseComponent from '../shared/abstract/baseComponent';
import { classes } from '../theme';

interface IState {
  profile?: IUser;
  routes: typeof ROUTES_ROLES;
}

export default class MorePage extends BaseComponent<IState> {
  public static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: 'Mais' as any,
    tabBarIcon: ({ tintColor }) => (
      <Icon name='menu' style={{ color: tintColor }} />
    )
  };

  constructor(props: any) {
    super(props);
    this.state = { routes: [] };
  }

  public componentDidMount(): void {
    profileService.get()
      .combineLatest(tokenService.getUser())
      .bindComponent(this)
      .logError()
      .subscribe(([profile, user]) => {
        const routes = !user ? [] : ROUTES_ROLES.filter(r => user.canAccess(...r.roles));
        this.setState({ profile, routes });
      }, err => toastError(err));
  }

  public render(): JSX.Element {
    const { profile, routes } = this.state;

    return (
      <Container style={classes.cardsContainer}>
        <Header>
          {isiOS ? <Left /> : null}
          <Body>
            <Title>Mais</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {!!profile &&
            <ListItem
              avatar
              button
              style={styles.itemProfile}
              onPress={() => this.navigate('Profile')}>
              <Left>
                {profile.avatar ?
                  <Thumbnail source={{ uri: profile.avatar }} />
                  :
                  <Icon name='contact' style={styles.avatarIcon} />
                }
              </Left>
              <Body style={styles.removeBorder}>
                <Text>{profile.fullName}</Text>
                <Text note>{profile.email}</Text>
              </Body>
              <Right style={styles.removeBorder}>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          }

          {!profile &&
            <ListItem avatar button onPress={() => this.navigate('Login')}>
              <Left>
                <Icon name='contact' style={styles.avatarIcon} />
              </Left>
              <Body style={styles.removeBorder}>
                <Text>Bem vindo!</Text>
                <Text note>Gostaríamos de te conhecer</Text>
              </Body>
              <Right style={styles.removeBorder}>
                <Icon name='arrow-forward' />
              </Right>
            </ListItem>
          }

          {!!routes.length &&
            <Card style={styles.cardMargin}>
              {routes.map(route =>
                <ListItem key={route.key} icon last button onPress={() => this.navigate(route.key)}>
                  <Left>
                    <Icon name={route.icon} />
                  </Left>
                  <Body>
                    <Text>{route.display}</Text>
                  </Body>
                  <Right>
                    <Icon name='arrow-forward' />
                  </Right>
                </ListItem>
              )}
            </Card>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  removeBorder: {
    borderBottomWidth: 0,
    alignItems: 'flex-start',
    alignSelf: 'center'
  },
  itemProfile: {
    marginTop: 10,
    paddingBottom: 10
  },
  avatarIcon: {
    fontSize: 65,
    width: 58,
    marginTop: 10,
    opacity: 0.6
  },
  cardMargin: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  }
});
