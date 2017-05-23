import { Body, Button, Container, Fab, Header, Icon, Left, Right, Text, Title, View } from 'native-base';

import BaseComponent from '../components/base';
import React from 'react';
import { StyleSheet } from 'react-native';

export default class ChurchReportPage extends BaseComponent {
  static navigationOptions = {
    headerVisible: false,
    drawerLabel: 'Relatório de Culto',
    drawerIcon: ({ tintColor }) => (
      <Icon name="list-box" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.navigate('ChurchReportForm');
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
            <Title>Relatório de Culto</Title>
          </Body>
          <Right />
        </Header>
        <View style={StyleSheet.flatten(styles.container)}>
          <Text>Here 2</Text>
          <Fab onPress={() => this.navigate('ChurchReportForm')}>
            <Icon name="add" />
          </Fab>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});