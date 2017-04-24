import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BaseComponent from '../components/base';
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
    this.state = { loading: true };
  }

  componentDidMount() {
    informativeService.list().subscribe(informatives => {
      informatives = informatives || [];
      this.setState({ loading: false, informatives });
    }, err => {
      console.log(err);
    });
  }

  details(informative) {
    this.navigate('InformativeDetails', { informative });
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
          <Right />
        </Header>
        <Content contentContainerStyle={StyleSheet.flatten(theme.contentWhite)}>
          {this.state.loading ?
            <View style={StyleSheet.flatten([theme.alignCenter])}>
              <Spinner />
            </View>
            :
            <List>
              {this.state.informatives.map(informative => 
                <TouchableOpacity key={informative.id}>
                  <ListItem button onPress={() => this.details(informative)}>
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
                </TouchableOpacity>  
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