import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Text } from 'native-base';
import React from 'react';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent } from '../../components/base';
import { PopupMenu } from '../../components/popupMenu';
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
            <PopupMenu actions={[{
              display: 'Teste',
              onPress: () => { }
            }]} />
          </Body>
          <Right />
        </Header>
        <Content >
          <Spinner />
          <Button onPress={() => toast('Pressed', 0)}>
            <Text>Test</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}