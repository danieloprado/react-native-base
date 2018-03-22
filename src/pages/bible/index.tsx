import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent } from '../../components/base';
import { toast } from '../../providers/toast';

export default class BiblePage extends BaseComponent {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Bíblia' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='bookmarks' style={{ color: tintColor }} />
    )
  };

  public componentDidMount(): void {
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Bíblia - A Mensagem</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Button onPress={() => toast('Não conseguimos se comunicar com o servidor')}>
            <Text>Test</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}