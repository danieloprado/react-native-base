import React from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import BaseComponent from '../components/base';
import theme from '../theme';
import dateFormatter from '../formatters/date';
import informativeService from '../services/informative';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  Text,
  List,
  ListItem
} from 'native-base';

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
    }, err => {
      console.log(err);
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