import { Body, Container, Content, Header, Icon, Left, Right, Title, View } from 'native-base';
import * as React from 'react';
import { NavigationTabScreenOptions } from 'react-navigation';

import { isiOS } from '../../settings';
import BaseComponent from '../../shared/abstract/baseComponent';
import ButtonHeaderProfile from '../../shared/buttonHeaderProfile';
import { classes } from '../../theme';
import ChurchCard from './components/churchCard';
import EventCard from './components/eventCard';
import EventFeaturedCard from './components/eventFeaturedCard';
import InformativeCard from './components/informativeCard';

export default class HomePage extends BaseComponent {
  public static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: 'Início' as any,
    tabBarIcon: ({ tintColor }) => (
      <Icon name='home' style={{ color: tintColor }} />
    )
  };

  public render(): JSX.Element {

    return (
      <Container style={classes.cardsContainer}>
        <Header>
          {isiOS ? <Left /> : null}
          <Body>
            <Title>ICB Sorocaba</Title>
          </Body>
          <Right>
            <ButtonHeaderProfile />
          </Right>
        </Header>
        <Content>
          <View style={classes.cardsPadding}>
            <EventFeaturedCard></EventFeaturedCard>
            <ChurchCard></ChurchCard>
            <InformativeCard></InformativeCard>
            <EventCard></EventCard>
          </View>
        </Content>
      </Container>
    );
  }
}
