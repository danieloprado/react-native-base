import React, { Component } from 'react';
import { StyleSheet, View, InteractionManager } from 'react-native';
import theme from '../theme';
import dateFormatter from '../formatters/date';
import informativeService from '../services/informative';
import Wrapper from '../theme/wrapper';
import {
  Content,
  Header,
  Left,
  Right,
  Body,
  Button,
  Title,
  Icon,
  Spinner,
  Text,
  List,
  ListItem
} from 'native-base';

export default class HomePage extends Component {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Informativos',
    drawerIcon: ({ tintColor }) => (
      <Icon name="paper" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  openDrawer() {
    this.props.navigation.navigate('DrawerOpen');
  }

  componentDidMount() {
    informativeService.list().subscribe(informatives => {
      informatives = informatives || [];
      InteractionManager.runAfterInteractions(() => {
        this.setState({ loading: false, informatives });
      });
    }, err => {
      console.log(err);
    });
  }

  render() {
    return (
      <Wrapper>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name='menu' />
            </Button>
          </Left>
          <Body>
              <Title>Informativos</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={StyleSheet.flatten(theme.contentWhite)}>
          {this.state.loading ?
            <View style={StyleSheet.flatten([theme.alignCenter])}>
              <Spinner />
            </View>
            :
            <List>
              { this.state.informatives.map(informative => 
                <ListItem key={informative.id}>
                  <Left style={StyleSheet.flatten(styles.iconWrapper)}>
                    <Icon name={informative.icon} style={StyleSheet.flatten(styles.icon)} />
                  </Left>
                  <Body>
                    <Text>{informative.title}</Text>
                    <Text note>{dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</Text>
                  </Body>
                  <Right style={StyleSheet.flatten(styles.iconWrapper)}>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )}    
            </List>
          }            
        </Content>  
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  iconWrapper: {
    flex: 0
  },
  icon: {
    width: 40,
    fontSize: 30
  }
});