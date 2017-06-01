import { Body, Button, Card, CardItem, Container, Content, Fab, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import { RefreshControl, StyleSheet } from 'react-native';

import BaseComponent from '../../components/base';
import React from 'react';
import churchReportService from '../../services/churchReport';
import dateFormatter from '../../formatters/date';
import theme from '../../theme';

export default class ChurchReportListPage extends BaseComponent {
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
      <Container style={StyleSheet.flatten(theme.cardsContainer)}>
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
              <Text note>Não conseguimos atualizar</Text>
            </View>
          }
          {!refreshing && !error && !reports.length &&
            <View style={StyleSheet.flatten(theme.emptyMessage)}>
              <Text note>Nenhum relatório criado</Text>
            </View>
          }
          {!refreshing && !error && reports.length &&
            <View style={StyleSheet.flatten(theme.cardsPadding)}>
              {reports.map(report =>
                <Card key={report.id}>
                  <CardItem header>
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
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Text>Here</Text>
                  </CardItem>
                </Card>
              )}
            </View>
          }
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
    paddingLeft: 0,
    flexDirection: 'column'
  },
  eventDay: {
    fontSize: 24,
  },
  eventWeekDay: {
  },
});