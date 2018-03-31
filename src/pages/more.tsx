import { Body, Container, Content, Header, Icon, Left, ListItem, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationTabScreenOptions } from 'react-navigation';

import { isiOS } from '../settings';
import BaseComponent from '../shared/abstract/baseComponent';
import { classes } from '../theme';

export default class MorePage extends BaseComponent {
  public static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: 'Mais' as any,
    tabBarIcon: ({ tintColor }) => (
      <Icon name='menu' style={{ color: tintColor }} />
    )
  };

  public render(): JSX.Element {

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
  avatarIcon: {
    fontSize: 65,
    width: 58,
    marginTop: 10
  }
});
