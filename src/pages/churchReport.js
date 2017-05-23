import { Body, Button, Container, Content, Fab, Header, Icon, Left, Right, Text, Title, View } from 'native-base';

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
    this.state = { active: true };
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
            <Title>Relatório de culto</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={StyleSheet.flatten(styles.container)}>
            <Text>Here 2</Text>
            <Fab
              active={this.state.active}
              position="bottomRight"
              style={{ backgroundColor: '#5067FF' }}
              onPress={() => this.setState({ active: !this.state.active })}>
              <Icon name="share" />
              <Button style={{ backgroundColor: '#34A34F' }}>
                <Icon name="logo-whatsapp" />
              </Button>
              <Button style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
              </Button>
              <Button disabled style={{ backgroundColor: '#DD5144' }}>
                <Icon name="mail" />
              </Button>
            </Fab>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  }
});