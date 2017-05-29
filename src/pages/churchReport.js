import { Body, Button, Container, Content, Fab, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { RefreshControl, StyleSheet } from 'react-native';

import BaseComponent from '../components/base';
import React from 'react';
import churchReportService from '../services/churchReport';
import dateFormatter from '../formatters/date';
import theme from '../theme';

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
    this.state = { refreshing: true, error: false, reports: [] };
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  load(refresh = false) {
    this.setState({ refreshing: true }, true);

    this.subscription = churchReportService.list(refresh).subscribe(reports => {
      this.setState({ refreshing: false, error: false, reports: reports || [] });
    }, () => {
      this.setState({ refreshing: false, error: true });
    });
  }

  render() {
    const { refreshing, reports, error } = this.state;

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
        <Content
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this.load(true)}
            />
          }>
          {!refreshing && error &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Não foi possível carregar</Text>
            </View>
          }
          {!refreshing && !error && !reports.length &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Nenhum relatório criado</Text>
            </View>
          }
          <List
            dataArray={reports}
            renderRow={report =>
              <ListItem
                button
                key={report.id}
                style={StyleSheet.flatten(theme.listItem)}
                onPress={() => this.details(report)}>
                <Left style={StyleSheet.flatten(styles.leftWrapper)}>
                  <Text style={StyleSheet.flatten(styles.eventDay)}>
                    {dateFormatter.format(report.date, 'DD')}
                  </Text>
                  <Text style={StyleSheet.flatten(styles.eventWeekDay)}>
                    {dateFormatter.format(report.date, 'MMM')}
                  </Text>
                </Left>
                <Body>
                  <Text>{report.title}</Text>
                  <Text note>{report.type.name}</Text>
                  <Text note>{`Total: ${report.total}`}</Text>
                </Body>
              </ListItem>
            }
          />
        </Content>
        <Fab onPress={() => this.navigate('ChurchReportForm')}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  leftWrapper: {
    maxWidth: 50,
    opacity: 0.5,
    flexDirection: 'column'
  },
  eventDay: {
    fontSize: 24,
    textAlign: 'center'
  },
  eventWeekDay: {
    textAlign: 'center'
  },
});