import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title } from 'native-base';
import React from 'react';
import { RefreshControl } from 'react-native';

import BaseComponent from '../../components/base';
import EmptyMessage from '../../components/emptyMessage';
import dateFormatter from '../../formatters/date';
import toast from '../../providers/toast';
import services from '../../services';
import { theme } from '../../theme';

export default class InformativeListPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Informativos',
    drawerIcon: ({ tintColor }) => (
      <Icon name="paper" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);

    this.informativeService = services.get('informativeService');
    this.state = { refreshing: true, informatives: [] };
  }

  componentDidMount() {
    this.load();
  }

  details(informative) {
    this.navigate('InformativeDetails', { informative });
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    this.informativeService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(informatives => {
        informatives = informatives || [];
        this.setState({ refreshing: false, informatives, error: false });
      }, () => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error: true });
      });
  }

  render() {
    const { refreshing, informatives, error } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Informativos</Title>
          </Body>
          <Right />
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
          }
        >
          {!refreshing && error && !informatives.length &&
            <EmptyMessage icon="sad" message="Não conseguimos atualizar" />
          }
          <List dataArray={informatives} renderRow={informative =>
            <ListItem button key={informative.id} style={theme.listItem} onPress={() => this.details(informative)}>
              <Left style={theme.listIconWrapper}>
                <Icon name={informative.icon} style={theme.listIcon} />
              </Left>
              <Body>
                <Text>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </Body>
              <Right style={theme.listIconWrapperSmall}>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          }
          />
        </Content>
      </Container>
    );
  }
}