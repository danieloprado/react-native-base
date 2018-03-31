import { Body, Container, Content, Header, Icon, Left, Right, Title, View } from 'native-base';
import * as React from 'react';
import { NavigationTabScreenOptions } from 'react-navigation';

import { isiOS } from '../settings';
import BaseComponent from '../shared/abstract/baseComponent';
import ButtonHeaderProfile from '../shared/buttonHeaderProfile';
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
          <Right>
            <ButtonHeaderProfile />
          </Right>
        </Header>
        <Content>
          <View>

          </View>
        </Content>
      </Container>
    );
  }
}
