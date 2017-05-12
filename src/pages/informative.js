import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import { RefreshControl, StyleSheet } from 'react-native';

import BaseComponent from '../components/base';
import React from 'react';
import dateFormatter from '../formatters/date';
import informativeService from '../services/informative';
import theme from '../theme';

export default class InformativePage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Informativos',
    drawerIcon: ({ tintColor }) => (
      <Icon name="paper" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
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

    informativeService.list(refresh).subscribe(informatives => {
      informatives = informatives || [];
      this.setState({ refreshing: false, informatives });
    }, () => {
      this.setState({ refreshing: false });
    });
  }

  render() {
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
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.load(true)}
            />
          }
        >
          {!this.state.refreshing && !this.state.informatives.length && 
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não foi possível carregar</Text>
            </View> 
          }  
          <List dataArray={this.state.informatives} renderRow={informative => 
            <ListItem
              button
              key={informative.id}
              onPress={() => this.details(informative)}>
              <Left style={StyleSheet.flatten(theme.listIconWrapper)}>
                <Icon name={informative.icon} style={StyleSheet.flatten(theme.listIcon)} />
              </Left>
              <Body>
                <Text>{informative.title}</Text>
                <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
              </Body>
              <Right style={StyleSheet.flatten(theme.listIconWrapper)}>
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